import QRCode from "qrcode";

export default async function generateQRUPI(upiId: string, payeeName: string, amount: string) {
    const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR`

    try {
        const qr = await QRCode.toDataURL(upiLink);
        return qr;
    } catch (error) {
        console.error("Failed to generate QR code.", error);
    }
}