import { useEffect } from 'react';
import BrandColors from '@utils/brandColors';

const usePageMetadata = () => {
  useEffect(() => {
    // Atualizar o título da página
    const brandName = BrandColors.getBrandName();
    document.title = brandName;

    // Atualizar os favicons
    const faviconBaseUrl = BrandColors.getBrandFaviconBaseUrl();
    
    const setFavicon = (selector, size) => {
      let element = document.querySelector(selector);
      if (element) {
        element.href = `${faviconBaseUrl}-${size}.png`;
      }
    };

    setFavicon("link[rel='icon'][sizes='32x32']", '32x32');
    setFavicon("link[rel='icon'][sizes='192x192']", '192x192');
    setFavicon("link[rel='apple-touch-icon']", '180x180');

    const msTile = document.querySelector("meta[name='msapplication-TileImage']");
    if (msTile) {
      msTile.content = `${faviconBaseUrl}-270x270.png`;
    }
  }, []);
};

export default usePageMetadata; 