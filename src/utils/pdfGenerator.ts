import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    console.log('Starting PDF generation...');

    // Ensure all images are loaded before capturing
    const images = element.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    await Promise.all(imagePromises);

    // Ensure fonts are loaded
    if ('fonts' in document) {
      await (document as any).fonts.ready;
    }

    // The standard A4 width is 210mm. At 96 DPI, this is ~794px.
    // We'll use a fixed windowWidth in html2canvas to ensure the media queries and layout 
    // are consistent with the preview.

    console.log('Capturing canvas with html2canvas...');
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      logging: true,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      onclone: (clonedDoc) => {
        // STYLE SANITIZATION: Remove all global styles that might contain oklch()
        // which html2canvas cannot parse.
        const styles = clonedDoc.getElementsByTagName('style');
        const links = clonedDoc.getElementsByTagName('link');
        Array.from(styles).forEach(s => s.remove());
        Array.from(links).forEach(l => l.remove());

        // Inject a minimal, safe stylesheet for the report
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
          body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
          #report-content * { box-sizing: border-box; }
        `;
        clonedDoc.head.appendChild(style);

        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = '794px';
          clonedElement.style.background = '#ffffff';
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '0';
        }
      }
    });

    console.log('Canvas captured. Processing image data...');
    // Add a small delay for image/font settling
    await new Promise(resolve => setTimeout(resolve, 300));

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    console.log('Image data generated. Creating PDF...');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    console.log('Saving PDF...');
    pdf.save(`${filename}.pdf`);
    console.log('PDF saved successfully');
  } catch (error: any) {
    console.error('CRITICAL: PDF Generation Error:', error);
    if (error.name === 'SecurityError') {
      alert('Security Error: Failed to capture images. This usually happens with restricted browser settings or external images.');
    } else {
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}. Check console for details.`);
    }
  }
}
