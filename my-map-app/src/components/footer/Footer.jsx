import React from "react";
import "./footers.css";

function Footer() {
  return (
    <footer>
        <div className="container-footer">
            <p>Web App</p>
            <div>
                <h4>Assistenza</h4>
                <h6>Centro Assistenza</h6>
                <h6>Opzione di Cancellazione</h6>
                <h6>Segnala qualche problema</h6>
            </div>
            <div>
                <h4>Affitare</h4>
                <h6>Forum della community</h6>
                <h6>Ospitare Responsabilmente</h6>
            </div>
            <div>
                <h4>Pubblicare</h4>
                <h6>Opportunità</h6>
                <h6>Nuove Funzionalità</h6>
            </div>
        </div>
        <hr className="hr"></hr>
      <p className="copyright">© 2025 Web App</p>
    </footer>
  );
}

export default Footer;