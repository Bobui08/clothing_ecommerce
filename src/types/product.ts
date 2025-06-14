export interface GetProductsQuery {
  name?: { $regex: string; $options: string };
  category?: string;
}

export interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetProductsResponse {
  products: ProductDocument[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateProductRequestBody {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
}

export interface ErrorResponse {
  error: string;
}

export interface ProductFormData {
  name?: string;
  description?: string;
  price?: number | string;
  image?: string;
  category?: string;
  stock?: number;
}

export interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isEdit?: boolean;
  isLoading?: boolean;
}
