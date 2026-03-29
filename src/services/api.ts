import axios from 'axios';

const SHEET_ID = '1P6aL26noUdb9G_we8vvcOXpulTlVZKMIpXMi8-hOo6c';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

// Replace this with your Google Apps Script Web App URL
const SUPPORT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw61yuGlpjvo83bdMkxL3VYX5CIGuDi89tj6YblDNIZigX0Vn8G7584YLLwPzQ0vrZx/exec';

export interface Product {
  id: number;
  product_name: string;
  category: string;
  subcategory: string;
  child_category: string;
  description: string;
  short_description: string;
  price: number;
  thumbnail_url: string;
  pdf_link: string;
  keywords: string;
  featured: boolean;
  status: string;
}

export interface Banner {
  banner_id: number;
  title: string;
  image_url: string;
  target_type: string;
  target_value: string;
  status: string;
}

export interface Config {
  [key: string]: string;
}

const parseGSheetJSON = (jsonString: string) => {
  const r = jsonString.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);
  if (r && r[1]) {
    const data = JSON.parse(r[1]);
    const cols = data.table.cols;
    const rows = data.table.rows;
    return rows.map((row: any) => {
      const item: any = {};
      row.c.forEach((cell: any, i: number) => {
        if (cols[i]) {
          item[cols[i].label || cols[i].id] = cell ? cell.v : null;
        }
      });
      return item;
    });
  }
  return [];
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${BASE_URL}&sheet=PRODUCTS`);
    const data = parseGSheetJSON(response.data);
    return data.filter((p: any) => p.status === 'active');
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchBanners = async (): Promise<Banner[]> => {
  try {
    const response = await axios.get(`${BASE_URL}&sheet=BANNERS`);
    const data = parseGSheetJSON(response.data);
    return data
      .filter((b: any) => b.status === 'active')
      .map((b: any) => ({
        banner_id: b.banner_id,
        title: b.banner_title || b.title,
        image_url: b.banner_image_url || b.image_url,
        target_type: b.target_type,
        target_value: b.target_value,
        status: b.status,
      }));
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
};

export const fetchConfig = async (): Promise<Config> => {
  try {
    const response = await axios.get(`${BASE_URL}&sheet=CONFIG`);
    const data = parseGSheetJSON(response.data);
    const config: Config = {};
    data.forEach((item: any) => {
      if (item.key && item.value) {
        config[item.key] = item.value;
      }
    });
    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    return {};
  }
};

export const submitContactForm = async (data: any): Promise<boolean> => {
  try {
    // If you haven't set up the URL yet, it will fail, so we'll log it
    if (SUPPORT_WEBAPP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.warn('SUPPORT_WEBAPP_URL is not configured. Form submission will not work.');
      return false;
    }

    const response = await axios.post(SUPPORT_WEBAPP_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200 || (response.data && response.data.status === 'success');
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return false;
  }
};
