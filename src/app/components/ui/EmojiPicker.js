import React from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function EmojiPicker(props) {

  const { onEmojiSelect, showPicker } = props

  return showPicker ? (
    <Picker
      data={data}
      onEmojiSelect={onEmojiSelect}
    />
  ) : null
}
