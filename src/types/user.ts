import type {Rol} from './index'
import axios  from '../app/axiosInstance';
export interface CustomUserResponse{
    id:number;
    username:string;
    rol:Rol;
}
export type CreateUserDto = {
  username: string
  password: string
  rol: number | null
}

export type UpdateUserDto = {
  username?: string
  password?: string
  rol?: number | null
}

export const fetchUsuarios=async():Promise<CustomUserResponse>=>{ 
    const {data}=await axios.get<CustomUserResponse>('/usuarios/');
    return data;
}
export const updateUsuario=async(id:number ,u:UpdateUserDto):Promise<CustomUserResponse>=>{ 
  const {data}=await axios.put<CustomUserResponse>(`/usuarios/${id}/`,u);
    return data;
}

export const partialUpdateUsuario=async(id:number,u: Partial<UpdateUserDto>):Promise<CustomUserResponse>=>{ 
const {data}=await axios.patch<CustomUserResponse>(`/usuarios/${id}/`,u);
return data;}

export function createUsuario(dto: CreateUserDto) {
  return axios.post('/usuarios/', dto)
}                                                
export const  fetchUsuario=async (id:number):Promise<CustomUserResponse>=>{
const {data}= await axios.get<CustomUserResponse>(`/usuarios/${id}/`)
 return data;
}