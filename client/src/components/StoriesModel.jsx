import React, { useState } from 'react'

const StoriesModel = () => {
    const bgColor = ["#4f46e5","#7c3aed","#db2777","#e11d48","#ca8a04","#0d9488"]
    const [mode,setMode] = useState("text")
    const [background,setBackground] = useState(bgColor[0])
    const [text,setText] = useState("")
    const [media,setMedia] = useState(null)
    const [previewUrl,setPreviewUrl] = useState(null)

    const handleMediaUpload = (e)=>{
        const file = e.target.files?.[0]
        if(file){
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    return (
    <div>
      
    </div>
  )
}

export default StoriesModel
