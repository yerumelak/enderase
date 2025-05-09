import React from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

const LanguageSelector = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const selectStyle = {
        color: "rgb(237, 118, 14)",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        fontSize: "1rem",
        cursor: "pointer",
        padding: "5px 10px",
        width: "fit-content"
    };

    return (
        <div>
            <select
                onChange={changeLanguage}
                defaultValue={i18n.language}
                style={selectStyle}
            >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
