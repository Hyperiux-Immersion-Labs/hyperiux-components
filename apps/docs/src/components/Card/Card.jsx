"use client";

import React from"react";
import"./Card.css";

const Card = ({
 children,

 // optional structured content
 title,
 subtitle,
 content,
 footer,

 // style controls
 padding ="2vw",
 borderColor ="rgba(0,0,0,0.2)",
 bg ="",
 radius ="1.2vw",
 shadow = false,

 className ="",
}) => {
 return (
 <div
 className={`card ${shadow ?"card--shadow" :""} ${className}`}
 style={{
"--card-padding": padding,
"--card-border": borderColor,
 //"--card-bg": bg,
"--card-radius": radius,
 }}
 >
 {/* FULL CUSTOM MODE */}
 {children ? (
 children
 ) : (
 <>
 {title && (
 <div className="card__header">
 <h3 className="card__title">{title}</h3>
 {subtitle && (
 <p className="card__subtitle">{subtitle}</p>
 )}
 </div>
 )}

 {content && <div className="card__content">{content}</div>}

 {footer && <div className="card__footer">{footer}</div>}
 </>
 )}
 </div>
 );
};

export default Card;