import React, { useState, useEffect } from 'react';

import './PageCounter.scss';

export function PageCounter ({ currPage, totalPages }) {
    return (
        <div className="page-counter">
            <p>{ currPage }</p>
            <hr/>
            <p>{ totalPages }</p>
        </div>
    );
}