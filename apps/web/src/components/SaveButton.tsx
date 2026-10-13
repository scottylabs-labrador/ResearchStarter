import React from 'react'

import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";

interface SaveButtonProp {
    bookmark: boolean;
}

const SaveButton = ({bookmark} : SaveButtonProp) => {
  return (
    bookmark ? <BookmarkIcon fontSize="large" /> : <BookmarkIconUnfilled fontSize="large" />
  )
}

export default SaveButton