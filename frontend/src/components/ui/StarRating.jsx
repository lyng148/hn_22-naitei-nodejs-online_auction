import React from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';

export const StarRating = ({
    rating = 0,
    maxRating = 5,
    size = 16,
    readonly = true,
    onRatingChange,
    showValue = false,
    className = ""
}) => {
    const handleStarClick = (starRating) => {
        if (!readonly && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    const renderStar = (index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;

        return (
            <button
                key={index}
                type="button"
                onClick={() => handleStarClick(starRating)}
                className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                    } transition-all duration-200 ${!readonly ? 'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded' : ''}`}
                disabled={readonly}
                title={readonly ? `Rating: ${rating}/${maxRating}` : `Rate ${starRating} star${starRating > 1 ? 's' : ''}`}
            >
                {isFilled ? (
                    <IoStar size={size} className="text-yellow-400" />
                ) : (
                    <IoStarOutline size={size} className={readonly ? "text-gray-300" : "text-gray-400 hover:text-yellow-400"} />
                )}
            </button>
        );
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex items-center">
                {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
            </div>
            {showValue && (
                <span className="text-sm text-gray-600 ml-2">
                    {rating.toFixed(1)}/{maxRating}
                </span>
            )}
        </div>
    );
};
