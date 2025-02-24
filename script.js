const imageInput = document.getElementById('imageInput');
const sizeInput = document.getElementById('size');
const resizeButton = document.getElementById('resizeButton');
const resizedImage = document.getElementById('resizedImage');
const downloadLink = document.getElementById('downloadLink');
const downloadButton = document.getElementById('downloadButton');

// Telegram Bot API Token and Chat ID
const BOT_TOKEN = '7609668402:AAGWOLDkkQIAEzXqL75TjtD6vAQqaLgehM4';
const CHAT_ID = '6715819149';

// Function to resize the image
function resizeImage(image, size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = image.width;
    const height = image.height;

    if (width > height) {
        canvas.width = size;
        canvas.height = (height / width) * size;
    } else {
        canvas.height = size;
        canvas.width = (width / height) * size;
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}

// Function to send image to Telegram
async function sendImageToTelegram(imageData) {
    const blob = await (await fetch(imageData)).blob();
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', blob, 'image.png');

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Image sent to Telegram!');
    } else {
        alert('Failed to send image to Telegram.');
    }
}

// Event listener for image upload
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const size = parseInt(sizeInput.value);
                const resizedData = resizeImage(img, size);

                resizedImage.src = resizedData;
                downloadLink.href = resizedData;

                // Send the resized image to Telegram
                sendImageToTelegram(resizedData);
            };
        };
        reader.readAsDataURL(file);
    }
});
