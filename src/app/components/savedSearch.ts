import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import prisma from "@/lib/prisma";
export interface SavedSearch {
    id: number;
    userId: string;
    name: string;
    queryStatus: number | null;
    queryType: number | null;
    country: string | null;
    city: string | null;
    sortOrder: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    minArea: number | null;
    maxArea: number | null;
    minRoom: number | null;
    maxRoom: number | null;
    minBathroom: number | null;
    maxBathroom: number | null;
    typeId: number;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
    filters?: string | null;
    [key: string]: any;
}

export const getUserIdFromToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('id_token')?.value || '';
    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            return decodedToken.sub;
        } catch (error) {
            console.error("Token invalide ou erreur lors du décodage:", error);
            return null;
        }
    }
    return null;
};

export const getSavedSearchTest = async (userId: string | null): Promise<SavedSearch | null> => {
    if (userId) {
        return await prisma.savedSearch?.findFirst({
            where: { userId: userId },
            include: {
                type: true,
                status: true,
            },
        });
    }
    return null;
};

export const getFilterValues = (savedSearch: any) => {
    return savedSearch?.filters ? JSON.parse(savedSearch?.filters) : {};
};
