'use server'
import {uploadImageToCloudinary} from '@/lib/cloudinary'

export const getImageURL= async (file:File) =>{
    try {
        const uploadUrl = await uploadImageToCloudinary(file)
        console.log(uploadUrl)
        return {success: true, url: uploadUrl}
    } catch (error) {
        console.log(error)
        return {success: false , url: ""}
    }
}