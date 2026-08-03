import ru from './portfolio/ru.json' with {type: 'json'};
import en from './portfolio/en.json' with {type: 'json'};
import {validatePortfolioCopy} from '../lib/portfolio/validate.js';

/** @type {import('~/types/portfolio').PortfolioCopy} */
export const portfolioCopy = validatePortfolioCopy({ru, en});
