import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FountainEnum } from "../../../domain/enums";
import { LeadDocument } from "../../schemas";

@Injectable()
export class LeadsAiSummaryService {
    constructor(
        @InjectModel(LeadDocument.name) private readonly leadModel: Model<LeadDocument>
    ) { }

    async getSummary(filters?: { fountain?: FountainEnum, range_date?: string }): Promise<string> {
        const filter: any = {};

        // 1. Obtener los leads que coincidan con el filtro
        if (filters?.fountain) {
            filter.source = filters.fountain;
        }

        if (filters?.range_date) {
            const dates = filters.range_date.split(',');
            if (dates.length === 2 && dates[0] && dates[1]) {
                const startDate = new Date(dates[0].trim());
                const endDate = new Date(dates[1].trim());

                if (dates[1].trim().length === 10) {
                    endDate.setUTCHours(23, 59, 59, 999);
                }

                filter.created_at = {
                    $gte: startDate,
                    $lte: endDate,
                };
            } else if (dates[0]) {
                filter.created_at = {
                    $gte: new Date(dates[0].trim()),
                };
            }
        }

        const leads = await this.leadModel.find(filter);

        if (leads.length === 0) {
            return "No se encontraron leads con los filtros proporcionados para generar el resumen ejecutivo.";
        }

        // Serializar los leads para mandarlos al LLM
        const serializedLeads = leads.map(doc => ({
            nombre: doc.name,
            email: doc.email,
            telefono: doc.phone,
            fuente: doc.source,
            producto_interes: doc.productInterest,
            presupuesto: doc.budget,
            creado_el: doc.created_at
        }));

        // 2. Enviar los datos a un LLM (Gemini)
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            try {
                const prompt = `Eres un experto en ventas y análisis de marketing.
A continuación tienes una lista de leads en formato JSON.
Analízalos y genera un resumen ejecutivo profesional y conciso en español. El resumen debe incluir exactamente:
1. Análisis general (métricas clave como cantidad de leads, presupuesto acumulado y promedio, y productos con mayor interés).
2. Fuente principal de procedencia de los leads.
3. Recomendaciones estratégicas de conversión.

Leads:
${JSON.stringify(serializedLeads, null, 2)}
`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });

                if (response.ok) {
                    const data = await response.json() as any;
                    return data.candidates[0].content.parts[0].text;
                } else {
                    const errText = await response.text();
                    console.error('Error de Gemini API:', errText);
                }
            } catch (err) {
                console.error('Error llamando a Gemini:', err);
            }
        }

        // =========================================================================
        // 3. Fallback inteligente (Mock LLM) con análisis real de los datos.
        // =========================================================================
        // Este bloque actúa como un respaldo robusto cuando la variable de entorno
        // GEMINI_API_KEY no está configurada. En lugar de fallar o retornar un texto
        // estático irrelevante, calcula en tiempo real métricas analíticas sobre el
        // conjunto exacto de leads filtrados para simular un análisis sumamente realista:
        //
        // - Volumen Total: Cantidad de registros encontrados.
        // - Presupuestos: Sumatoria total y promedio aritmético exacto.
        // - Fuente más efectiva (mainFountain): Encuentra el canal ('source') con más registros.
        // - Producto más deseado (favoriteProduct): Encuentra el producto de interés predominante.
        // =========================================================================
        const total = serializedLeads.length;
        const totalBudget = serializedLeads.reduce((acc, lead) => acc + (lead.presupuesto ?? 0), 0);
        const avgBudget = total > 0 ? (totalBudget / total).toFixed(2) : '0';

        // Determinar la fuente principal de adquisición (Moda estadística de 'source')
        const fountainCounts: { [key: string]: number } = {};
        serializedLeads.forEach(lead => {
            const f = lead.fuente ?? 'other';
            fountainCounts[f] = (fountainCounts[f] ?? 0) + 1;
        });
        const mainFountain = Object.entries(fountainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'other';

        // Determinar el producto estrella con mayor tracción (Moda estadística de 'productInterest')
        const productCounts: { [key: string]: number } = {};
        serializedLeads.forEach(lead => {
            const p = lead.producto_interes ?? 'Ninguno';
            productCounts[p] = (productCounts[p] ?? 0) + 1;
        });
        const favoriteProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Curso Avanzado de NestJS';

        // Retorna la simulación del análisis ejecutivo perfectamente estructurada
        return `### 📊 RESUMEN EJECUTIVO INTELIGENTE (Simulado por IA - Configure la variable de entorno GEMINI_API_KEY para real)

#### 1. Análisis General
* **Volumen de Leads:** Se han identificado un total de **${total} leads** bajo los filtros aplicados.
* **Presupuesto Promedio:** El presupuesto promedio es de **$${avgBudget} USD** (Presupuesto total acumulado: **$${totalBudget} USD**).
* **Interés de Producto:** El producto con mayor tracción es **"${favoriteProduct}"**, concentrando la mayor proporción del interés de los contactos.

#### 2. Fuente Principal de Procedencia
* La fuente con mayor tasa de atracción es **"${mainFountain.toUpperCase()}"**, lo que demuestra una alta efectividad en las campañas asociadas a este canal. Se recomienda robustecer la retención en esta vía de adquisición.

#### 3. Recomendaciones Estratégicas de Conversión
* **Optimización de Presupuestos:** Diseñar una campaña de venta consultiva para los leads con presupuestos superiores a la media ($${avgBudget} USD), ofreciéndoles tutorías exclusivas o planes corporativos de mayor valor.
* **Nutrición Automatizada (Email Marketing):** Implementar flujos de automatización para nutrir a los leads provenientes de fuentes más frías como redes sociales, enviándoles contenido técnico sobre "${favoriteProduct}".
* **Estrategia Multi-canal:** Aprovechar el éxito del canal **"${mainFountain}"** para clonar audiencias similares en el resto de los canales que muestran menor volumen de conversión.`;
    }
}