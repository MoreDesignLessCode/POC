import React from "react";
import "./Footer.css"

export default function footer() {
  return (
    <footer>
    <div className={"footer-background-homepage"}>
    <div className={ `footer-container homepageFooter`}>
        <div className={"copy-content-footer" }>© 2023 Demo</div>
        <div className={ "links-footer" }>
            <a href="/" target="_blank" rel="noreferrer">Terms & Conditions | Privacy</a>
            
        </div>
    </div>
    </div>
    </footer>

  );
}
