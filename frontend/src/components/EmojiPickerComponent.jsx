import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

export default function EmojiPickerComponent({ onSelectEmoji }) {
    return (
        <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={(e) => onSelectEmoji(e.emoji)} />
        </div>

    );
}
