import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonToast,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./Scan.css";

/* ---------------- HINTS ZXing ------------------ */
const HINTS: Map<DecodeHintType, any> = new Map();
HINTS.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.CODE_128,
  BarcodeFormat.ITF,
  BarcodeFormat.CODE_39,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
]);
HINTS.set(DecodeHintType.TRY_HARDER, true);

/* ---------------- Parseo heurístico original ------------------ */
type ParsedReceipt = {
  referencia?: string;
  servicio?: string;
  importe?: string;
  fechaVencimiento?: string;
  raw?: string;
};
function parseCFEBill(raw: string): ParsedReceipt {
  const text = (raw || "").replace(/\s+/g, " ").trim();
  const onlyDigits = text.replace(/\D+/g, " ");
  const digitBlocks = onlyDigits
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);
  let referencia: string | undefined;
  let servicio: string | undefined;
  const sorted = [...digitBlocks].sort((a, b) => b.length - a.length);
  if (sorted[0]) referencia = sorted[0];
  if (sorted[1]) servicio = sorted[1];
  const mImporte = text.match(/(?:\$|\b)(\d{1,6}(?:[.,]\d{2}))\b/);
  const importe = mImporte ? mImporte[1].replace(",", ".") : undefined;
  const mFecha = text.match(/\b(\d{2}[/-]\d{2}[/-]\d{4})\b/);
  const fechaVencimiento = mFecha?.[1];
  return { referencia, servicio, importe, fechaVencimiento, raw };
}

/* ---------- Parseo CFE desde 30 dígitos ---------- */
function parseCFEFromDigits(digits: string) {
  const clean = digits.replace(/\D/g, "");
  if (clean.length < 30) return null;
  const s = clean.slice(-30);
  const ref12 = s.slice(2, 14);
  const yy = s.slice(14, 16);
  const mm = s.slice(16, 18);
  const dd = s.slice(18, 20);
  const amountIntStr = s.slice(20, 29);
  const lastDecimal = s.slice(29);
  const amountInt = parseInt(amountIntStr, 10);
  const decimal = parseInt(lastDecimal, 10);
  if (Number.isNaN(amountInt) || Number.isNaN(decimal)) return null;
  const amount = Number(`${amountInt}.${decimal}`);
  const dueISO = `20${yy}-${mm}-${dd}`;
  return { ref12, amount, dueISO, digits: s };
}

/* ---------- Utilidades canvas / preproceso ---------- */
const ROI = { widthPct: 0.86, heightPct: 0.26 }; // rectángulo centrado

function cropToCanvas(
  srcCanvas: HTMLCanvasElement,
  dstCanvas: HTMLCanvasElement,
  sx: number, sy: number, sw: number, sh: number
) {
  dstCanvas.width = sw; dstCanvas.height = sh;
  const sctx = srcCanvas.getContext("2d", { willReadFrequently: true })!;
  const dctx = dstCanvas.getContext("2d", { willReadFrequently: true })!;
  const img = sctx.getImageData(sx, sy, sw, sh);
  dctx.putImageData(img, 0, 0);
}
function scaleNearest(src: HTMLCanvasElement, dst: HTMLCanvasElement, factor = 2) {
  dst.width = Math.round(src.width * factor);
  dst.height = Math.round(src.height * factor);
  const dctx = dst.getContext("2d", { willReadFrequently: true })!;
  dctx.imageSmoothingEnabled = false;
  dctx.drawImage(src, 0, 0, dst.width, dst.height);
}
function preprocess1D(src: HTMLCanvasElement, dst: HTMLCanvasElement) {
  const w = src.width, h = src.height;
  dst.width = w; dst.height = h;
  const sctx = src.getContext("2d", { willReadFrequently: true })!;
  const dctx = dst.getContext("2d", { willReadFrequently: true })!;
  const img = sctx.getImageData(0, 0, w, h);
  const data = img.data;

  const gamma = 0.9;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    let y = 0.299 * r + 0.587 * g + 0.114 * b;
    y = 255 * Math.pow(y / 255, gamma);
    data[i] = data[i + 1] = data[i + 2] = y;
  }

  const window = Math.max(9, Math.floor(w * 0.06) | 1);
  const half = (window / 2) | 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0, cnt = 0;
      for (let k = -half; k <= half; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k));
        sum += data[(y * w + xx) * 4];
        cnt++;
      }
      const idx = (y * w + x) * 4;
      const thr = (sum / cnt) - 8;
      const val = data[idx] < thr ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = val;
    }
  }
  dctx.putImageData(img, 0, 0);

  const factor = 1.6;
  const tmp = document.createElement("canvas");
  scaleNearest(dst, tmp, factor);
  scaleNearest(tmp, dst, 1 / factor);
}
async function tryDecode(reader: any, canvases: HTMLCanvasElement[]): Promise<string | null> {
  for (const c of canvases) {
    try {
      if (reader.decodeFromCanvas) {
        const res = await reader.decodeFromCanvas(c);
        const t = res?.getText?.();
        if (t) return t;
      }
    } catch {}
    try {
      if (reader.decodeFromImageElement) {
        const img = new Image();
        img.src = c.toDataURL("image/png");
        await new Promise((r) => (img.onload = () => r(null)));
        const res = await reader.decodeFromImageElement(img);
        const t = res?.getText?.();
        if (t) return t;
      }
    } catch {}
  }
  return null;
}

/* ------------------------------ Componente --------------------------- */
export default function Scan() {
  const [present] = useIonToast();
  const router = useIonRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const viewCanvasRef = useRef<HTMLCanvasElement | null>(null); // frame completo
  const processedRef = useRef<HTMLCanvasElement | null>(null);   // preview procesada
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

  const [cameraOn, setCameraOn] = useState(false);
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedReceipt | null>(null);

  const [ref12, setRef12] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [dueISO, setDueISO] = useState<string | null>(null);
  const [digits, setDigits] = useState<string | null>(null);

  const roiCssRect = useMemo(() => ({
    widthPct: ROI.widthPct * 100,
    heightPct: ROI.heightPct * 100,
  }), []);

  /* --------- listar cámaras (solo si usarás “video en vivo”) ---------- */
  useEffect(() => {
    (async () => {
      let cams = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!cams.length || !cams.some((d) => d.label)) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ video: true });
          s.getTracks().forEach((t) => t.stop());
          cams = await BrowserMultiFormatReader.listVideoInputDevices();
        } catch {/* noop */}
      }
      const back = cams.find((d) => /back|rear|environment/i.test(d.label));
      setDevices(cams);
      setSelectedDeviceId((back ?? cams[0])?.deviceId);
    })();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("getUserMedia no soportado.");
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        throw new Error("La cámara requiere HTTPS o localhost.");
      }
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          // @ts-ignore
          advanced: [{ focusMode: "continuous" }, { exposureMode: "continuous" }],
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        await new Promise((r) => {
          if (videoRef.current!.readyState >= 2) return r(null);
          videoRef.current!.onloadeddata = () => r(null);
        });
      }
      if (!readerRef.current) readerRef.current = new BrowserMultiFormatReader(HINTS);

      setCameraOn(true);
      setRaw(""); setParsed(null);
      setRef12(null); setAmount(null); setDueISO(null); setDigits(null);
    } catch (e: any) {
      present({ message: e?.message || "No se pudo abrir la cámara.", duration: 2400, color: "danger" });
    }
  }
  function stopCamera() {
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    streamRef.current = null;
    setCameraOn(false);
  }

  /* --------- NUEVO: Tomar foto con cámara nativa --------- */
  async function takePhotoAndScan() {
    try {
      // apaga cualquier stream abierto
      stopCamera();

      let webPath: string | undefined;

      if (Capacitor.isNativePlatform()) {
        const photo = await Camera.getPhoto({
          source: CameraSource.Camera,
          resultType: CameraResultType.Uri,
          quality: 90,
          allowEditing: true,        // en iOS abre crop UI; en muchos Android depende del fabricante
          saveToGallery: false,
          correctOrientation: true,
          presentationStyle: "fullscreen",
        });
        webPath = photo.webPath || photo.path || undefined;
      } else {
        // fallback web (por si lo usas en navegador de escritorio)
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        (input as any).capture = "environment";
        const file: File = await new Promise((resolve, reject) => {
          input.onchange = () => {
            const f = (input.files?.[0]);
            f ? resolve(f) : reject(new Error("No file"));
          };
          input.click();
        });
        webPath = URL.createObjectURL(file);
      }

      if (!webPath) throw new Error("No se obtuvo la foto.");

      await decodeFromUrl(webPath);

      if (!Capacitor.isNativePlatform()) {
        // liberar blob si fue creado por URL.createObjectURL
        URL.revokeObjectURL(webPath);
      }
    } catch (e: any) {
      present({ message: e?.message || "No se pudo tomar la foto.", duration: 2000, color: "danger" });
    }
  }

  async function decodeFromUrl(url: string) {
    if (!readerRef.current) readerRef.current = new BrowserMultiFormatReader(HINTS);

    // Carga respetando EXIF
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    await new Promise((r, j) => {
      img.onload = () => r(null);
      img.onerror = () => j(new Error("Error al cargar la imagen"));
    });

    // Pintar a canvas y aplicar ROI+preproceso (como con archivo)
    const view = viewCanvasRef.current!;
    view.width = img.naturalWidth; view.height = img.naturalHeight;
    const vctx = view.getContext("2d", { willReadFrequently: true })!;
    vctx.drawImage(img, 0, 0);

    const rw = Math.round(view.width * ROI.widthPct);
    const rh = Math.round(view.height * ROI.heightPct);
    const rx = Math.round((view.width - rw) / 2);
    const ry = Math.round((view.height - rh) / 2);

    const roi = document.createElement("canvas");
    cropToCanvas(view, roi, rx, ry, rw, rh);

    const pre = document.createElement("canvas");
    preprocess1D(roi, pre);

    const scaled = document.createElement("canvas");
    scaleNearest(pre, scaled, 1.8);

    const anyReader: any = readerRef.current;
    const text =
      (await tryDecode(anyReader, [pre, scaled])) ||
      (await tryDecode(anyReader, [roi])) ||
      (await tryDecode(anyReader, [view]));

    // preview para debug
    const pctx = processedRef.current!.getContext("2d", { willReadFrequently: true })!;
    processedRef.current!.width = pre.width;
    processedRef.current!.height = pre.height;
    pctx.drawImage(pre, 0, 0);

    if (text) {
      setRaw(text);
      setParsed(parseCFEBill(text));
      const cfe = parseCFEFromDigits(text);
      if (cfe) { setRef12(cfe.ref12); setAmount(cfe.amount); setDueISO(cfe.dueISO); setDigits(cfe.digits); }
      present({ message: "Código detectado", duration: 1400, color: "success" });
    } else {
      present({ message: "No se detectó el código en la foto.", duration: 1800, color: "warning" });
    }
  }

  /* --------- Capturar frame del <video> (si decides usar live) --------- */
  async function captureAndScan() {
    try {
      const video = videoRef.current;
      const viewCanvas = viewCanvasRef.current;
      const processedCanvas = processedRef.current;
      if (!video || !viewCanvas || !processedCanvas) throw new Error("Video/canvas no disponible.");
      const vw = video.videoWidth, vh = video.videoHeight;
      if (!vw || !vh) throw new Error("La cámara aún no entregó frames (videoWidth=0).");

      viewCanvas.width = vw; viewCanvas.height = vh;
      const vctx = viewCanvas.getContext("2d", { willReadFrequently: true })!;
      vctx.drawImage(video, 0, 0, vw, vh);

      const rw = Math.round(vw * ROI.widthPct);
      const rh = Math.round(vh * ROI.heightPct);
      const rx = Math.round((vw - rw) / 2);
      const ry = Math.round((vh - rh) / 2);

      const roiCanvas = document.createElement("canvas");
      cropToCanvas(viewCanvas, roiCanvas, rx, ry, rw, rh);

      const preCanvas = document.createElement("canvas");
      preprocess1D(roiCanvas, preCanvas);

      const pctx = processedCanvas.getContext("2d", { willReadFrequently: true })!;
      processedCanvas.width = preCanvas.width;
      processedCanvas.height = preCanvas.height;
      pctx.drawImage(preCanvas, 0, 0);

      const scaled1 = document.createElement("canvas");
      scaleNearest(preCanvas, scaled1, 1.8);
      const scaled2 = document.createElement("canvas");
      scaleNearest(roiCanvas, scaled2, 2);

      if (!readerRef.current) readerRef.current = new BrowserMultiFormatReader(HINTS);
      const anyReader: any = readerRef.current;

      const text =
        (await tryDecode(anyReader, [preCanvas, scaled1])) ||
        (await tryDecode(anyReader, [scaled2])) ||
        (await tryDecode(anyReader, [viewCanvas]));

      if (text) {
        setRaw(text);
        setParsed(parseCFEBill(text));
        const cfe = parseCFEFromDigits(text);
        if (cfe) { setRef12(cfe.ref12); setAmount(cfe.amount); setDueISO(cfe.dueISO); setDigits(cfe.digits); }
        present({ message: "Código detectado", duration: 1400, color: "success" });
      } else {
        present({ message: "No se detectó el código. Alinea dentro del rectángulo.", duration: 1800, color: "warning" });
      }
    } catch (e: any) {
      present({ message: e?.message || "No se pudo capturar la foto.", duration: 1600, color: "danger" });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="bnrt-toolbar">
          <IonTitle className="bnrt-title">Escanear recibo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="scan-content ion-padding">
        <div className="phone-shell">
          <div className="phone-notch" />
          <h2 className="screen-title">Escanea código de barras</h2>

          {/* Botón principal: cámara nativa */}
          <IonButton expand="block" className="bnrt-btn" onClick={takePhotoAndScan}>
            Tomar foto (cámara del teléfono)
          </IonButton>

          {/* Opcional: cámara en vivo (si quieres mantenerla) */}
          {!cameraOn ? (
            <IonButton expand="block" className="bnrt-btn" onClick={startCamera}>
              Abrir cámara en vivo
            </IonButton>
          ) : (
            <>
              <IonButton expand="block" className="bnrt-btn danger" onClick={stopCamera}>
                Cerrar cámara en vivo
              </IonButton>
              <IonButton expand="block" className="bnrt-btn" onClick={captureAndScan}>
                Capturar foto y escanear
              </IonButton>
            </>
          )}

          {/* Fallback subir imagen (fuerza cámara en móviles web) */}
          <div className="uploader">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) {
                  const url = URL.createObjectURL(f);
                  decodeFromUrl(url).finally(() => URL.revokeObjectURL(url));
                }
              }}
            />
          </div>

          {/* Viewer + overlay ROI (solo para live preview) */}
          <div className="video-wrap">
            <video ref={videoRef} className={`video ${cameraOn ? "on" : ""}`} muted playsInline />
            <div
              className="roi-overlay"
              style={{ width: `${roiCssRect.widthPct}%`, height: `${roiCssRect.heightPct}%` }}
            />
          </div>

          {/* Canvas oculto frame y preview visible de procesado */}
          <canvas ref={viewCanvasRef} style={{ display: "none" }} />
          <div className="processed-wrap">
            <h4>Vista previa procesada</h4>
            <canvas ref={processedRef} className="processed-canvas" />
          </div>

          {/* Resultado */}
          <div className="result-block">
            <h3 className="result-title">Texto detectado</h3>
            <p className="result-text">{raw || "—"}</p>

            <div className="service-card">
              <div className="service-logo">CFE</div>
              <div className="service-info">
                <div className="service-name">CFE</div>
                <div className="service-ref">
                  <span>Referencia:</span>{" "}
                  <strong>{ref12 ?? parsed?.referencia ?? "No detectada"}</strong>
                </div>
                {amount != null && dueISO && (
                  <div className="service-extra">
                    <span>Monto:</span> <strong>${amount.toLocaleString("es-MX")}</strong>
                    <span className="sep">•</span>
                    <span>Vence:</span>{" "}
                    <strong>{dueISO.split("-").reverse().join("-")}</strong>
                  </div>
                )}
              </div>
            </div>

            <IonButton
              expand="block"
              className="bnrt-cta-btn"
              disabled={!ref12}
              onClick={() => {
                if (ref12) {
                  stopCamera();
                  router.push(
                    `/servicios/confirm?ref=${encodeURIComponent(ref12)}&amount=${encodeURIComponent(
                      amount ?? ""
                    )}&due=${encodeURIComponent(dueISO ?? "")}&raw=${encodeURIComponent(digits ?? "")}`,
                    "forward"
                  );
                }
              }}
            >
              <span className="bnrt-cta-dot" /> Siguiente
            </IonButton>
          </div>

          {!raw && (
            <IonText color="medium">
              <p className="tip">
                Toma la foto con la cámara nativa, recorta si te lo permite y asegúrate de que el
                código quede **dentro del rectángulo**. Si prefieres, usa la cámara en vivo y toca para
                enfocar; en móviles web, el botón “Elegir archivo” también abre la cámara trasera.
              </p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
