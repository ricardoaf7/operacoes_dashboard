import L from 'leaflet';
import { TeamType } from '../types';

const createIcon = (svg: string) => {
    return L.divIcon({
        html: svg,
        className: 'bg-transparent border-0',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
    });
};

export const TeamIcons: Record<TeamType, L.DivIcon> = {
    'Giro Zero': createIcon(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-cyan-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 014 0v.5A2.5 2.5 0 0114.5 11H13v-1a1 1 0 00-1-1H8v-1a1 1 0 011-1h2a1 1 0 100-2H9a1 1 0 00-1 1v1H6.5A1.5 1.5 0 005 6.5V6c0-.526.474-.97.984-1.216a6.035 6.035 0 01-1.652 3.243z" clip-rule="evenodd" />
        </svg>
    `),
    'Acabamento': createIcon(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-yellow-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
        </svg>
    `),
    'Coleta': createIcon(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-orange-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v5a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2z" />
        </svg>
    `),
    'Touceiras': createIcon(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-lime-400 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7" />
        </svg>
    `),
    'Manutenção': createIcon(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-rose-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
    `),
    'Irrigação': createIcon(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-sky-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
        </svg>
    `),
};

export const GardenIcon = createIcon(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-500 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 4.293a1 1 0 010 1.414l-1.414 1.414-1.414-1.414a1 1 0 111.414-1.414l1.414 1.414zM10.707 9.293a1 1 0 010 1.414L9.293 12.121l-1.414-1.414a1 1 0 111.414-1.414l1.414 1.414zM4.293 2.707a1 1 0 011.414 0l1.414 1.414-1.414 1.414a1 1 0 11-1.414-1.414L4.293 2.707zM9.293 7.879a1 1 0 011.414 0l1.414 1.414-1.414 1.414a1 1 0 11-1.414-1.414L9.293 7.879zM15 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4 10a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd" />
    </svg>
`);

export const IrregularDiscardIcon = createIcon(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
`);

export const AdoptedAreaIcon = createIcon(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-400 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0V7.418zM12.25 10.5a2.5 2.5 0 01-2.25 2.45V15h.25a.75.75 0 010 1.5H9.75a.75.75 0 010-1.5h.25v-2.05a2.5 2.5 0 01-2.25-2.45V5.45a2.5 2.5 0 012.45-2.25c1.313 0 2.45 1.135 2.45 2.45v5.05zM11.5 8.5v-3.05a1 1 0 00-1-1c-.552 0-1 .448-1 1V8.5h2z" />
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5z" />
    </svg>
`);

export const BroomIcon = createIcon(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400 drop-shadow-lg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 12h18l-9 9-9-9Z"></path>
        <path d="M12 3v9"></path>
    </svg>
`);
