// CardSobres.js
import React from 'react';
import './cardPack.css';

const CardSobres = ({ type }) => {
    const getBackgroundClass = (type) => {
        switch (type) {
            case 'super-basico':
                return 'super-basico-bg';
            case 'basico':
                return 'basico-bg';
            case 'normal':
                return 'normal-bg';
            case 'vip':
                return 'vip-bg';
            case 'premium':
                return 'premium-bg';
            default:
                return 'default-bg';
        }
    };

    return (
        <div className={`card-sobre ${getBackgroundClass(type)}`}>
            <h2>{type}</h2>
        </div>
    );
};

export default CardSobres;
