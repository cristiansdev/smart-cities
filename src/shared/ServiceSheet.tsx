import React, { useMemo, useRef, useState } from "react";
import { IonModal, IonIcon, useIonRouter, useIonToast } from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./ServiceSheet.css";

type Service = { id: number; name: string; logo: string };

type Props = {
  isOpen: boolean;
  presentingElement?: HTMLElement | null;
  service: Service | null;
  onDismiss: () => void;
  onContinue: (payload: { serviceId: number | null; reference: string }) => void;
};

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

/* ---------- Parseo CFE 30 dígitos ---------- */
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

/* ---------- Preproceso ---------- */
const ROI = { widthPct: 0.86, heightPct: 0.26 };

function cropToCanvas(
  src: HTMLCanvasElement,
  dst: HTMLCanvasElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number
) {
  dst.width = sw;
  dst.height = sh;
  const sctx = src.getContext("2d", { willReadFrequently: true })!;
  const dctx = dst.getContext("2d", { willReadFrequently: true })!;
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
  for (let yy = 0; yy < h; yy++) {
    for (let x = 0; x < w; x++) {
      let sum = 0, cnt = 0;
      for (let k = -half; k <= half; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k));
        sum += data[(yy * w + xx) * 4];
        cnt++;
      }
      const idx = (yy * w + x) * 4;
      const thr = sum / cnt - 8;
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

const ServiceSheet: React.FC<Props> = ({
  isOpen,
  presentingElement,
  service,
  onDismiss,
  onContinue,
}) => {
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const router = useIonRouter();
  const [present] = useIonToast();

  const title = useMemo(() => service?.name ?? "", [service?.name]);

  const handleContinue = () => {
    if (!reference.trim()) return;
    onContinue({ serviceId: service?.id ?? null, reference: reference.trim() });
  };

  async function decodeFromUrl(url: string) {
    if (!readerRef.current) readerRef.current = new BrowserMultiFormatReader(HINTS);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    await new Promise((r, j) => {
      img.onload = () => r(null);
      img.onerror = () => j(new Error("Error al cargar la imagen"));
    });

    const view = document.createElement("canvas");
    view.width = img.naturalWidth;
    view.height = img.naturalHeight;
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
    return text || null;
  }

  async function handleScanButton() {
    try {
      setBusy(true);

      let webPath: string | undefined;

      if (Capacitor.isNativePlatform()) {
        const photo = await Camera.getPhoto({
          source: CameraSource.Camera,
          resultType: CameraResultType.Uri,
          quality: 90,
          allowEditing: true, // recorte del SO si está disponible
          saveToGallery: false,
          correctOrientation: true,
          presentationStyle: "fullscreen",
        });
        webPath = photo.webPath || photo.path || undefined;
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        (input as any).capture = "environment";
        const file: File = await new Promise((resolve, reject) => {
          input.onchange = () => {
            const f = input.files?.[0];
            f ? resolve(f) : reject(new Error("No file"));
          };
          input.click();
        });
        webPath = URL.createObjectURL(file);
      }

      if (!webPath) throw new Error("No se obtuvo la foto.");

      const text = await decodeFromUrl(webPath);

      if (!Capacitor.isNativePlatform()) URL.revokeObjectURL(webPath);

      if (!text) {
        present({ message: "No se detectó el código. Acerca y mantenlo horizontal.", duration: 1800, color: "warning" });
        return;
      }

      const cfe = parseCFEFromDigits(text);
      if (!cfe) {
        present({ message: "No se pudo interpretar el recibo.", duration: 1600, color: "warning" });
        return;
      }

      setReference(cfe.ref12); // por si no navega

      const url =
        `/servicios/confirm?ref=${encodeURIComponent(cfe.ref12)}` +
        `&amount=${encodeURIComponent(cfe.amount ?? "")}` +
        `&due=${encodeURIComponent(cfe.dueISO ?? "")}` +
        `&raw=${encodeURIComponent(cfe.digits ?? "")}`;

      onDismiss();
      router.push(url, "forward");
    } catch (e: any) {
      present({ message: e?.message || "No se pudo abrir la cámara.", duration: 2000, color: "danger" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      presentingElement={presentingElement ?? undefined}
      backdropDismiss
      className="ss-modal"
      initialBreakpoint={0.6}
      breakpoints={[0, 0.6, 0.92]}
    >
      {/* Contenido del modal (tarjeta) */}
      <div className="ss-card">
        <div className="ss-grabber" />

        <div className="ss-header">
          {service?.logo && <img src={service.logo} alt="" className="ss-logo" />}
          <div className="ss-title-wrap">
            <h2 className="ss-title">Ingresa una referencia o escanea</h2>
            <p className="ss-sub">el código de barras</p>
          </div>
        </div>

        <div className="ss-input-row">
          <input
            className="ss-input"
            type="text"
            inputMode="numeric"
            placeholder="Referencia, cuenta, teléfono"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <button
            type="button"
            className={`ss-input-icon ${busy ? "is-busy" : ""}`}
            aria-label="Escanear código de barras"
            onClick={busy ? undefined : handleScanButton}
            disabled={busy}
          >
            <IonIcon icon={cameraOutline} />
          </button>
        </div>

        <button type="button" className="ss-help">
          ¿Dónde encontrar estos datos en mi recibo?
        </button>

        <button
          type="button"
          className="ss-cta"
          disabled={!reference.trim()}
          onClick={() => onContinue({ serviceId: service?.id ?? null, reference: reference.trim() })}
        >
          Continuar
        </button>
      </div>
    </IonModal>
  );
};

export default ServiceSheet;
