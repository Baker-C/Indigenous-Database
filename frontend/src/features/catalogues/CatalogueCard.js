import React from 'react'
import '../../styles/cataloguecard.css'

const CatalogueCard = ({ title, owner }) => {
    return (
        <div class="catalogue-card">
            <div class="catalogue-header">
                <div className="catalogue-image-container">
                    <img src="/assets/Catalogue_Img_Placeholder.jpg" className="catalogue-image" />
                </div>
                <div class="catalogue-info">
                    <h2 class="catalogue-title">{title}</h2>
                    <p class="catalogue-author">{owner}</p>
                </div>
                <p class="catalogue-description">Description of the catalogue goes here...</p>
            </div>
        </div>
    )
}

export default CatalogueCard