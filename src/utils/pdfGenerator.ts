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

    console.log('Capturing canvas with html2canvas...');
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      onclone: (clonedDoc) => {
        const styles = clonedDoc.getElementsByTagName('style');
        const links = clonedDoc.getElementsByTagName('link');
        Array.from(styles).forEach(s => s.remove());
        Array.from(links).forEach(l => l.remove());

        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
          body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; }
          #report-content * { box-sizing: border-box; }
        `;
        clonedDoc.head.appendChild(style);

        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = '794px';
          clonedElement.style.display = 'flex';
          clonedElement.style.flexDirection = 'column';
          clonedElement.style.background = '#ffffff';

          // A4 at 96 DPI is ~1123px high.
          const a4Height = 1123;
          const naturalHeight = clonedElement.scrollHeight;
          const totalPages = Math.ceil(naturalHeight / a4Height);
          const forcedHeight = totalPages * a4Height;

          clonedElement.style.height = `${forcedHeight}px`;
          clonedElement.style.minHeight = `${forcedHeight}px`;
          clonedDoc.body.style.height = `${forcedHeight}px`;
          clonedDoc.body.style.overflow = 'hidden';
        }
      }
    });

    console.log('Canvas captured. Processing image data...');
    await new Promise(resolve => setTimeout(resolve, 300));

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');

    // Convert current height position to mm (1px = 0.264583mm at 96dpi)
    // But jspdf handles the scale internally usually if we provide widths.
    // We just need to subtract full page heights.
    heightLeft -= pdfHeight;

    // Add subsequent pages
    while (heightLeft > 0.5) { // 0.5mm threshold to avoid empty sliver pages
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
    alert(`Failed to generate PDF: ${error.message || 'Unknown error'}. Check console for details.`);
  }
}

export async function generatePNG(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const images = element.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    await Promise.all(imagePromises);

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to generate PNG:', error);
  }
}
