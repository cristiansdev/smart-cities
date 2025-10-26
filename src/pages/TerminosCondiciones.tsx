import React from 'react';
import './TerminosCondiciones.css';

interface TerminosCondicionesProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

const TerminosCondiciones: React.FC<TerminosCondicionesProps> = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline 
}) => {
  if (!isOpen) return null;

  return (
    <div className="terminos-overlay">
      <div className="terminos-modal">
        {/* Header */}
        <div className="terminos-header">
          <div className="header-content">
            <button className="back-button" onClick={onClose}>
              <span className="close-icon">×</span>
              Cerrar
            </button>
            <div className="header-spacer"></div>
          </div>
        </div>

        {/* Content */}
        <div className="terminos-content">
          <div className="terminos-container">
            {/* Logo Banorte */}
            <div className="logo-section">
              <img 
                src="/assets/Logo_ban   .png" 
                alt="Banorte" 
                className="banorte-logo"
              />
            </div>

            {/* Confirmación */}
            <div className="confirmacion-section">
              <h2 className="confirmacion-title">Confirmación</h2>
            </div>

            {/* Términos y Condiciones */}
            <div className="terminos-section">
              <h3 className="terminos-title">Términos y Condiciones</h3>
              
              <div className="terminos-text">
                <p>
                  Al activar EcoCash, aceptas que tus consumos de agua, luz y gas sean 
                  analizados de forma anónima y agregada para calcular promedios por zona 
                  y determinar recompensas por consumo responsable.
                </p>
                
                <p>
                  Puedes darte de baja en cualquier momento desde la app.
                </p>
                
                <p>
                  Tus datos están protegidos conforme a la Política de Privacidad de Banorte.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons-section">
              <button className="accept-button" onClick={onAccept}>
                Aceptar y activar
              </button>
              
              <button className="decline-button" onClick={onDecline}>
                No, tal vez después
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondiciones;