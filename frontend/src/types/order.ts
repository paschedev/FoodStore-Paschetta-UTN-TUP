import { Product } from './product';

export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'TERMINADO' | 'ENTREGADO' | 'CANCELADO';
export type PaymentMethod = 'TARJETA' | 'TRANSFERENCIA' | 'EFECTIVO';

export interface OrderDetail {
  cantidad: number;
  subtotal: number;
  producto: Product;
}

export interface Order {
  id: number;
  fecha: string;
  estado: OrderStatus;
  total: number;
  formaPago: PaymentMethod;
  detalles: OrderDetail[];
  usuarioDto: {
    id: number;
    nombre: string;
    apellido: string;
    mail: string;
    celular: string;
    rol: string;
  };
}
