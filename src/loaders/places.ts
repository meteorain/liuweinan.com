import {API_SECRET, API_URL} from "astro:env/server";

interface Place {
    id: number;
    name: string;
    name_en?: string;
    type?: string;
    location?: string;
    coordinates?: string;
    rating?: number;
    visit_date?: string;
    description?: string;
    photos?: string;
    moments_id?: number;
    created_at: string;
    updated_at: string;
}

export function placesLoader() {
    return {
        name: "places-loader",
        load: async () => {
            try {
                const url = `${API_URL}/places`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${API_SECRET}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                return data.places || [];
            } catch (error) {
                console.error('Error loading places:', error);
                return [];
            }
        },
    };
}

