"use client";
// It is just a sample content scrollable wrapper not a reusable component
import React from "react";
import "./ScrollablePopupContent.css";

const ScrollablePopupContent = ({
    title = "Popup Title",
    subtitle = "",
    sections = [],
    className = "",
}) => {
    return (
        <div className={`scrollable-popup ${className}`}>
            <div className="scrollable-popup__inner">
                <div className="scrollable-popup__header">
                    <p className="scrollable-popup__eyebrow">Overview</p>
                    <h2 className="scrollable-popup__title">{title}</h2>
                    {subtitle ? (
                        <p className="scrollable-popup__subtitle">{subtitle}</p>
                    ) : null}
                </div>

                <div className="scrollable-popup__body">
                    {sections.map((section, index) => (
                        <div key={index} className="scrollable-popup__section">
                            {section.heading ? (
                                <h3 className="scrollable-popup__section-title">
                                    {section.heading}
                                </h3>
                            ) : null}

                            {section.paragraph ? (
                                <p className="scrollable-popup__text">{section.paragraph}</p>
                            ) : null}

                            {section.list?.length ? (
                                <ul className="scrollable-popup__list">
                                    {section.list.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrollablePopupContent;