// Schools Program Types Content Index

import { BSN_PROGRAMS_CONTENT } from './bsn-programs-content';
import { ONLINE_PROGRAMS_CONTENT } from './online-programs-content';
import { ACCELERATED_BSN_CONTENT } from './accelerated-programs-content';
import { ASSOCIATE_PROGRAMS_CONTENT } from './associate-programs-content';
import { MSN_PROGRAMS_CONTENT } from './msn-programs-content';

export { BSN_PROGRAMS_CONTENT, ONLINE_PROGRAMS_CONTENT, ACCELERATED_BSN_CONTENT, ASSOCIATE_PROGRAMS_CONTENT, MSN_PROGRAMS_CONTENT };

// Content map for easy lookup by program type slug
export const PROGRAM_TYPE_CONTENT_MAP: Record<string, string> = {
    'bsn': BSN_PROGRAMS_CONTENT,
    'online': ONLINE_PROGRAMS_CONTENT,
    'accelerated': ACCELERATED_BSN_CONTENT,
    'associate': ASSOCIATE_PROGRAMS_CONTENT,
    'msn': MSN_PROGRAMS_CONTENT,
};
