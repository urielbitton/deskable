import React from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function EmojiPicker(props) {

  const { onEmojiSelect, showPicker } = props

  return showPicker ? (
    <div style={{transform: 'scale(0.9)'}}>
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
      />
    </div>
  ) : null
}
