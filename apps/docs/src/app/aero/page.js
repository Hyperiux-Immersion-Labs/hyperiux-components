import React from'react'
import HomeAero from'@/components/TextAnims/HomeAero'

const page = () => {
 return (
 <>
 <HomeAero
 text="One hover, and suddenly your UI has personality"
 colors={{ color1:'#a78bfa', color2:'#fb7185', color3:'#fde68a' }}
 enableEntryAnimation={true}
 />
 </>
 )
}

export default page