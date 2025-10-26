import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToggle,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Scan.css"; // reutilizamos la paleta/estilos base

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// ✅ Formato pedido: dd-mm-aaaa
function formatISO(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return "";
  }
}

function formatMoney(n?: number | string) {
  if (n === undefined || n === null || n === "") return "0.00";
  const num = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function ServiceConfirm() {
  const q = useQuery();

  const ref = q.get("ref") || "";
  const dueISO = q.get("due") || "";
  const rawAmount = q.get("amount") || "";

  const amount = useMemo(() => {
    const n = Number(rawAmount);
    return Number.isFinite(n) ? n : 0;
  }, [rawAmount]);

  const [saveService, setSaveService] = useState(false);
  const router = useIonRouter();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="bnrt-toolbar">
          <IonTitle className="bnrt-title">Pagar Servicio</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="scan-content ion-padding">
        <div className="phone-shell" style={{ paddingTop: 18 }}>
          <h2 className="screen-title" style={{ textAlign: "left", marginBottom: 0 }}>
            Monto a pagar
          </h2>

          {/* Monto grande */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0 6px" }}>
            <span className="currency" style={{ fontWeight: 800, fontSize: 22 }}>$</span>
            <span style={{ fontWeight: 800, fontSize: 42, lineHeight: 1 }}>
              {formatMoney(amount)}
            </span>
            <span style={{ marginLeft: 6, color: "#6B7278", fontWeight: 700 }}>MXN</span>
          </div>

          <p style={{ color: "#4A4F55", marginTop: 6 }}>
            Esta cantidad debe coincidir con tu recibo y no puedes cambiarla.
          </p>

          {/* Tarjeta CFE */}
          <div
            style={{
              borderRadius: 18,
              padding: 16,
              background: "#EFE9E5",
              border: "6px solid #505A63",
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#E6F4EA",
                  color: "#169B45",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 26,
                }}
              >
                CFE
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: "#2D2F33", fontSize: 20 }}>CFE</div>

                <div style={{ marginTop: 4, color: "#56606A" }}>
                  <span style={{ color: "#7A828A", fontWeight: 700 }}>Referencia:</span>{" "}
                  <span style={{ fontWeight: 800 }}>{ref || "—"}</span>
                </div>

                <div style={{ marginTop: 2, color: "#56606A" }}>
                  <span style={{ color: "#7A828A", fontWeight: 700 }}>Vence:</span>{" "}
                  <span style={{ fontWeight: 800 }}>{formatISO(dueISO) || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guardar Servicio */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 800, color: "#C60023", fontSize: 20, marginBottom: 6 }}>
              Guardar Servicio
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ color: "#4A4F55", flex: 1 }}>
                Guárdalo y haz más rápido tus próximos pagos.
              </div>
              <IonToggle
                checked={saveService}
                onIonChange={(e) => setSaveService(!!e.detail.checked)}
              />
            </div>
          </div>

          {/* CTA Pagar */}
          <IonButton
            expand="block"
            className="bnrt-cta-btn"
            style={{ marginTop: 18, height: 54, borderRadius: 20, fontSize: 18 }}
            onClick={() => {
              // Aquí integrarías el flujo de pago real
               router.push("/operacion-exitosa");
              //console.log("Pagar ->", { ref, amount, dueISO, saveService });
            }}
          >
            Pagar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
