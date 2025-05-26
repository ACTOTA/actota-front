import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Basic HTML form for testing uploads
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GCS Upload Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], input[type="file"] { width: 100%; padding: 8px; }
        button { background: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; }
        button:hover { background: #45a049; }
        pre { background: #f4f4f4; padding: 10px; overflow: auto; }
        .result { margin-top: 20px; border: 1px solid #ddd; padding: 10px; display: none; }
        .success { color: green; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h1>GCS Upload Test</h1>
      
      <div class="form-group">
        <label for="itineraryId">Itinerary ID:</label>
        <input type="text" id="itineraryId" name="itineraryId" value="test-${Date.now()}" />
      </div>
      
      <div class="form-group">
        <label for="fileUpload">Select Image:</label>
        <input type="file" id="fileUpload" name="file" accept="image/*" />
      </div>
      
      <button id="uploadBtn">Upload Image</button>
      
      <div id="result" class="result">
        <h3>Upload Result</h3>
        <div id="statusMessage"></div>
        <pre id="responseData"></pre>
        <div id="imagePreview"></div>
      </div>

      <div class="form-group" style="margin-top: 30px;">
        <h3>Test Update Images API</h3>
        <label for="updateItineraryId">Itinerary ID for Update:</label>
        <input type="text" id="updateItineraryId" name="updateItineraryId" value="" />
        <label for="imageUrls">Image URLs (one per line):</label>
        <textarea id="imageUrls" style="width: 100%; height: 100px;"></textarea>
        <button id="updateBtn">Test Update Images API</button>
      </div>
      
      <div id="updateResult" class="result">
        <h3>Update Images Result</h3>
        <div id="updateStatusMessage"></div>
        <pre id="updateResponseData"></pre>
      </div>
      
      <script>
        document.getElementById('uploadBtn').addEventListener('click', async () => {
          const resultDiv = document.getElementById('result');
          const statusMessage = document.getElementById('statusMessage');
          const responseData = document.getElementById('responseData');
          const imagePreview = document.getElementById('imagePreview');
          
          resultDiv.style.display = 'block';
          statusMessage.innerHTML = 'Uploading...';
          statusMessage.className = '';
          responseData.innerText = '';
          imagePreview.innerHTML = '';
          
          const itineraryId = document.getElementById('itineraryId').value;
          const fileInput = document.getElementById('fileUpload');
          
          if (!fileInput.files || fileInput.files.length === 0) {
            statusMessage.innerHTML = 'Error: Please select a file to upload';
            statusMessage.className = 'error';
            return;
          }
          
          const file = fileInput.files[0];
          
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('itineraryId', itineraryId);
            formData.append('timestamp', Date.now().toString());
            
            const response = await fetch('/api/upload/itinerary-image', {
              method: 'POST',
              body: formData
            });
            
            const responseText = await response.text();
            let responseJson;
            
            try {
              responseJson = JSON.parse(responseText);
              responseData.innerText = JSON.stringify(responseJson, null, 2);
              
              if (response.ok) {
                statusMessage.innerHTML = 'Upload successful!';
                statusMessage.className = 'success';
                
                // Auto-fill the update form
                document.getElementById('updateItineraryId').value = itineraryId;
                document.getElementById('imageUrls').value = responseJson.url;
                
                // Display the image
                if (responseJson.url) {
                  const img = document.createElement('img');
                  img.src = responseJson.url;
                  img.style.maxWidth = '100%';
                  img.style.maxHeight = '300px';
                  img.alt = 'Uploaded image';
                  imagePreview.appendChild(img);
                }
              } else {
                statusMessage.innerHTML = 'Upload failed: ' + (responseJson.error || 'Unknown error');
                statusMessage.className = 'error';
              }
            } catch (e) {
              responseData.innerText = responseText;
              statusMessage.innerHTML = 'Upload failed: Could not parse response as JSON';
              statusMessage.className = 'error';
            }
          } catch (error) {
            statusMessage.innerHTML = 'Upload failed: ' + error.message;
            statusMessage.className = 'error';
            responseData.innerText = error.stack || 'No error details available';
          }
        });
        
        document.getElementById('updateBtn').addEventListener('click', async () => {
          const resultDiv = document.getElementById('updateResult');
          const statusMessage = document.getElementById('updateStatusMessage');
          const responseData = document.getElementById('updateResponseData');
          
          resultDiv.style.display = 'block';
          statusMessage.innerHTML = 'Updating...';
          statusMessage.className = '';
          responseData.innerText = '';
          
          const itineraryId = document.getElementById('updateItineraryId').value;
          const imageUrlsText = document.getElementById('imageUrls').value;
          
          if (!itineraryId) {
            statusMessage.innerHTML = 'Error: Please enter an itinerary ID';
            statusMessage.className = 'error';
            return;
          }
          
          // Parse image URLs (one per line)
          const imageUrls = imageUrlsText.split('\\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);
          
          if (imageUrls.length === 0) {
            statusMessage.innerHTML = 'Error: Please enter at least one image URL';
            statusMessage.className = 'error';
            return;
          }
          
          try {
            const encodedId = encodeURIComponent(itineraryId);
            const updateUrl = \`/api/update-images?id=\${encodedId}\`;
            
            const response = await fetch(updateUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ images: imageUrls }),
              credentials: 'include'
            });
            
            const responseText = await response.text();
            let responseJson;
            
            try {
              responseJson = JSON.parse(responseText);
              responseData.innerText = JSON.stringify(responseJson, null, 2);
              
              if (response.ok) {
                statusMessage.innerHTML = 'Update successful!';
                statusMessage.className = 'success';
              } else {
                statusMessage.innerHTML = 'Update failed: ' + (responseJson.error || 'Unknown error');
                statusMessage.className = 'error';
              }
            } catch (e) {
              responseData.innerText = responseText;
              statusMessage.innerHTML = 'Update failed: Could not parse response as JSON';
              statusMessage.className = 'error';
            }
          } catch (error) {
            statusMessage.innerHTML = 'Update failed: ' + error.message;
            statusMessage.className = 'error';
            responseData.innerText = error.stack || 'No error details available';
          }
        });
      </script>
    </body>
    </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to generate test upload page: ${error.message}` },
      { status: 500 }
    );
  }
}