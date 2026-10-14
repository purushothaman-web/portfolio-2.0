import React from 'react';

interface SkillIconProps {
    name: string;
    className?: string;
    size?: number;
}

export const SkillIcon: React.FC<SkillIconProps> = ({ name, className = '', size = 16 }) => {
    const lower = name.toLowerCase();

    // 1. React (Official Cyan Atom)
    if (lower.includes('react') && !lower.includes('reactive')) {
        return (
            <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" className={`shrink-0 ${className}`}>
                <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
                <g stroke="#00d8ff" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
            </svg>
        );
    }

    // 2. TypeScript (Official Blue Badge)
    if (lower.includes('typescript')) {
        return (
            <svg width={size} height={size} viewBox="0 0 128 128" className={`shrink-0 ${className}`}>
                <rect width="128" height="128" rx="20" fill="#3178c6" />
                <path d="M72.5 86.5V41.5h14.5v45c0 6.6 4.4 9.5 9.5 9.5 3.5 0 6.5-1.2 8-2.5l2 11c-3.5 2-8.5 3.5-15 3.5-12.5 0-19-6.5-19-17zM20 41.5h43v12H48v55H35v-55H20v-12z" fill="#ffffff" />
            </svg>
        );
    }

    // 3. JavaScript (Official Yellow Badge) - MUST be before next.js because "JavaScript (ESNext)" has "next"
    if (lower.includes('javascript') || lower.includes('esnext')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M0 0h24v24H0V0z" fill="#F7DF1E" />
                <path d="M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" fill="#000000" />
            </svg>
        );
    }

    // 4. Next.js (Official Monogram)
    if (lower.includes('next')) {
        return (
            <svg width={size} height={size} viewBox="0 0 180 180" className={`shrink-0 ${className}`}>
                <circle cx="90" cy="90" fill="#000000" r="90" />
                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="#ffffff" />
                <rect fill="#ffffff" height="72" width="12" x="115" y="54" />
            </svg>
        );
    }

    // 5. Node.js (Official Hexagon)
    if (lower.includes('node') && !lower.includes('nodemailer') && !lower.includes('npm')) {
        return (
            <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`}>
                <path d="M16 2.5L3.5 9.7v14.6L16 31.5l12.5-7.2V9.7L16 2.5z" fill="#339933" />
                <path d="M16 4.8l10.5 6v12.4l-10.5 6-10.5-6V10.8l10.5-6z" fill="#026e00" />
                <path d="M16 7.5L7.5 12.4v9.8l8.5 4.9 8.5-4.9v-9.8L16 7.5z" fill="#68a063" />
                <path d="M16 11.2l-5 2.9v5.8l5 2.9 5-2.9v-5.8l-5-2.9z" fill="#ffffff" />
            </svg>
        );
    }

    // 6. Express.js (Official Simple Icons mark)
    if (lower.includes('express')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M12.262 16.666h1.146l6.975-9.325H19.22zm9.778 1.441v.004l-4.334-5.706-.557.74 4.873 6.682H.945V4.173h9.505l5.026 6.7.574-.772-4.374-5.928h.003l-.719-.945H0v17.544h24zM10.917 8.705a3.8 3.8 0 0 0-1.292-1.183q-.796-.45-1.916-.45c-.746 0-1.37.14-1.906.424a3.76 3.76 0 0 0-1.31 1.12 4.9 4.9 0 0 0-.75 1.581 7.17 7.17 0 0 0 0 3.696c.148.567.402 1.101.75 1.573a3.5 3.5 0 0 0 1.31 1.066q.803.39 1.906.389 1.77 0 2.739-.868.966-.867 1.328-2.457h-1.139q-.271 1.084-.977 1.734-.704.651-1.952.65-.812 0-1.392-.342a3.1 3.1 0 0 1-.957-.869 3.5 3.5 0 0 1-.551-1.182 5 5 0 0 1-.17-1.133 9 9 0 0 0-.015-.286 4.5 4.5 0 0 1 .015-.829c.047-.418.147-.83.296-1.223A3.7 3.7 0 0 1 5.54 9.05a2.9 2.9 0 0 1 .922-.742q.541-.28 1.246-.28c.47 0 .869.093 1.23.28q.541.281.922.742.379.461.587 1.057t.225 1.246H5.625l.004.957h6.182a7.3 7.3 0 0 0-.18-1.924 4.9 4.9 0 0 0-.715-1.68z" fill="#0f172a" />
            </svg>
        );
    }

    // 7. Tailwind CSS (Official Cyan Waves)
    if (lower.includes('tailwind')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#38bdf8" />
            </svg>
        );
    }

    // 8. Framer Motion (Official Purple Geometry)
    if (lower.includes('framer') || lower.includes('motion')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="#a855f7" />
            </svg>
        );
    }

    // 9. HTML5 (Official Orange Shield)
    if (lower.includes('html')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="#e34f26">
                <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17.6 5.8H4.9l.4 4.5h13.4l-.4 4.5-5.3 1.5-5.3-1.5-.3-3.4H3.8l.5 5.6L12 20.3l7.7-2.3 1.4-12.2z" />
            </svg>
        );
    }

    // 10. PostgreSQL (Official Slonik Elephant - Authentic Full Vector from Simple Icons)
    if (lower.includes('postgres')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="#336791">
                <path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z" />
            </svg>
        );
    }

    // 11. Prisma (Official Prism Pyramid)
    if (lower.includes('prisma')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M21.57 18.49L13.11 2.58a1.26 1.26 0 0 0-2.22 0L2.43 18.49a1.27 1.27 0 0 0 1.11 1.86h16.92a1.27 1.27 0 0 0 1.11-1.86z" fill="#0d9488" />
                <path d="M12 5.59l6.57 12.35H5.43L12 5.59z" fill="#2dd4bf" />
            </svg>
        );
    }

    // 12. MongoDB (Official Green Leaf)
    if (lower.includes('mongo')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M12 0.5C11.6 1.7 8.5 7.5 8.5 12c0 3.8 2.2 7.2 3.5 9 1.3-1.8 3.5-5.2 3.5-9 0-4.5-3.1-10.3-3.5-11.5z" fill="#15803d" />
                <path d="M12 1.5c.2.6 3.1 7.2 3.1 10.5 0 3.2-1.7 6.2-3.1 8.2v-18.7z" fill="#22c55e" />
                <path d="M12 21.5c-.3.8-.5 1.5-.5 2 0 .3.2.5.5.5s.5-.2.5-.5c0-.5-.2-1.2-.5-2z" fill="#15803d" />
            </svg>
        );
    }

    // 13. NeonDB (Official Neon Emerald N Shape)
    if (lower.includes('neon')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="5" fill="#00e599" />
                <path d="M6 18.5V5.5l12 13V5.5" stroke="#041b15" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
        );
    }

    // 14. Git & GitHub
    if (lower.includes('github') || lower.includes('git & github')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="#24292F">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
        );
    }
    if (lower.includes('git')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="#F05032">
                <path d="M23.546 10.93L13.067.452a1.5 1.5 0 0 0-2.124 0L8.83 2.564l3.328 3.327a1.782 1.782 0 0 1 2.25 2.258l3.208 3.208a1.78 1.78 0 1 1-.986.953l-3.036-3.036a1.78 1.78 0 0 1-2.127-.225 1.782 1.782 0 0 1-.295-2.09L8.066 3.854 1.528 10.39a1.5 1.5 0 0 0 0 2.124l10.479 10.48a1.5 1.5 0 0 0 2.124 0l9.415-9.416a1.5 1.5 0 0 0 0-2.648z" />
            </svg>
        );
    }

    // 15. Postman (Official Runner Orange)
    if (lower.includes('postman')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <circle cx="12" cy="12" r="10.5" fill="#FF6C37" />
                <path d="M8 12.5l3.5 3.5 5-7.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
        );
    }

    // 16. Vite Bundler (Official Purple/Yellow Lightning)
    if (lower.includes('vite')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M23.15 2.587L12.55.228a.864.864 0 0 0-.37 0L1.58 2.587a.867.867 0 0 0-.66.845L0 19.34a.867.867 0 0 0 .52.793l11.48 3.79a.867.867 0 0 0 .54 0l11.48-3.79a.867.867 0 0 0 .52-.793l-.92-15.908a.867.867 0 0 0-.66-.845z" fill="#bd34fe" />
                <path d="M12 1.34l9.74 2.17-6.22 10.7-3.52-6.1-3.52 6.1L2.26 3.51 12 1.34z" fill="#ffea83" />
            </svg>
        );
    }

    // 17. Vercel (Official Black Triangle)
    if (lower.includes('vercel')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M12 2L23 21H1L12 2Z" fill="#000000" />
            </svg>
        );
    }

    // 18. npm & Node Ecosystem (Official Red Block)
    if (lower.includes('npm')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="4" fill="#CB3837" />
                <path d="M4 6h16v12h-8v-9h-4v9H4V6z" fill="#ffffff" />
            </svg>
        );
    }

    // 19. Linux Shell / GNU Bash (Official Bash Icon in #4EAA25)
    if (lower.includes('linux') || lower.includes('shell') || lower.includes('bash')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="5" fill="#1e293b" />
                <path d="M6 7l5 5-5 5M12 17h6" stroke="#4EAA25" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
        );
    }

    // 20. Cloudinary Storage (Official Blue Cloud with Upload Arrow)
    if (lower.includes('cloudinary')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <path d="M24 14.8598c0 2.1729-1.3757 3.974-3.5903 4.6996l-.0995.0318V17.989c1.3777-.5805 2.1869-1.7275 2.1869-3.1291-.0072-2-1.6087-3.6288-3.6082-3.6699h-.5964l-.1432-.5686c-.7025-2.8996-3.2886-4.9489-6.2721-4.97a6.3915 6.3915 0 0 0-5.811 3.664l-.1828.3757-.4175.0437a4.4311 4.4311 0 0 0-3.3052 2.088c-1.2803 2.0856-.6274 4.8143 1.4583 6.0947v1.6897h-.01l-.149-.0675a5.9402 5.9402 0 0 1-3.3658-4.3494c-.5787-3.2291 1.57-6.3161 4.7991-6.8948a7.8766 7.8766 0 0 1 6.9839-4.149c3.4724.025 6.535 2.28 7.5901 5.5883 2.5789.3366 4.5138 2.5245 4.5327 5.1251z" fill="#3448C5" />
                <path d="M12 9l-3.5 3.5h2v4h3v-4h2L12 9z" fill="#ffffff" />
            </svg>
        );
    }

    // 21. Environment Secrets (.env) - Amber Shield Lock
    if (lower.includes('.env') || lower.includes('secret') || lower.includes('environment')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect x="3" y="9" width="18" height="13" rx="3" fill="#0f172a" />
                <path d="M7 9V6a5 5 0 0 1 10 0v3" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="12" cy="15" r="1.75" fill="#f59e0b" />
            </svg>
        );
    }

    // 22. Nodemailer (Email)
    if (lower.includes('nodemailer') || lower.includes('email')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="5" fill="#22c55e" />
                <path d="M4 6.5h16v11H4z" fill="#ffffff" />
                <path d="M4 7.5l8 5.5 8-5.5" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        );
    }

    // 23. Socket.IO (WebSockets) - Official Simple Icons
    if (lower.includes('socket') || lower.includes('websocket')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="#010101">
                <path d="M11.9362.0137a12.1694 12.1694 0 00-2.9748.378C4.2816 1.5547.5678 5.7944.0918 10.6012c-.59 4.5488 1.7079 9.2856 5.6437 11.6345 3.8608 2.4179 9.0926 2.3199 12.8734-.223 3.3969-2.206 5.5118-6.2277 5.3858-10.2845-.058-4.0159-2.31-7.9167-5.7588-9.9796C16.354.5876 14.1431.0047 11.9362.0137zm-.063 1.696c4.9448-.007 9.7886 3.8137 10.2815 8.9245.945 5.6597-3.7528 11.4125-9.4875 11.5795-5.4538.544-10.7245-4.0798-10.8795-9.5566-.407-4.4338 2.5159-8.8346 6.6977-10.2995a9.1126 9.1126 0 013.3878-.647zm5.0908 3.2248c-2.6869 2.0849-5.2598 4.3078-7.8886 6.4567 1.2029.017 2.4118.016 3.6208.01 1.41-2.165 2.8589-4.3008 4.2678-6.4667zm-5.6647 7.6536c-1.41 2.166-2.86 4.3088-4.2699 6.4737 2.693-2.0799 5.2548-4.3198 7.9017-6.4557a255.4132 255.4132 0 00-3.6318-.018z" />
            </svg>
        );
    }

    // 24. JWT Authentication (Official JSON Web Tokens Rainbow Ring)
    if (lower.includes('jwt') || lower.includes('auth')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <circle cx="12" cy="12" r="11" fill="#000000" />
                <path d="M10.2 3v4.456L12 9.928l1.8-2.472V3zm3.6 4.456v2.072l2.904-.96L18.52 5.36l-2.028-1.536zm2.904 2.112l-1.8 2.496 2.928.936 3.144-1.192-.628-2.232zm-6.504 7.976L12 15.072l-1.8 2.472V21h3.6zm-3.6 0v-2.072l-2.904.96L5.48 18.64l2.028 1.536z" fill="#d946ef" />
                <circle cx="12" cy="12" r="3" fill="#ffffff" />
            </svg>
        );
    }

    // 25. Zod Request Validation (Official Zod Logo in #408AFF)
    if (lower.includes('zod') || lower.includes('validation')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="#408AFF">
                <path d="M2.584 3.582a2.247 2.247 0 0 1 2.112-1.479h14.617c.948 0 1.794.595 2.115 1.487l2.44 6.777a2.248 2.248 0 0 1-.624 2.443l-9.61 8.52a2.247 2.247 0 0 1-2.963.018L.776 12.773a2.248 2.248 0 0 1-.64-2.467Zm12.038 4.887-9.11 5.537 5.74 5.007c.456.399 1.139.396 1.593-.006l5.643-5.001H14.4l6.239-3.957c.488-.328.69-.947.491-1.5l-1.24-3.446a1.535 1.535 0 0 0-1.456-1.015H5.545a1.535 1.535 0 0 0-1.431 1.01l-1.228 3.37z" />
            </svg>
        );
    }

    // 26. Role-Based Access (RBAC) - Shield with Security Lock & Key in Royal Indigo
    if (lower.includes('rbac') || lower.includes('role')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="5" fill="#4f46e5" />
                <path d="M12 4L5 7v5c0 4.5 3 8 7 9 4-1 7-4.5 7-9V7l-7-3z" fill="#ffffff" />
                <circle cx="12" cy="11" r="2" fill="#4f46e5" />
                <path d="M12 13v3" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }

    // 27. Middleware & Error Handling - Pipeline Interceptor Flow in Amber
    if (lower.includes('middleware') || lower.includes('error')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="5" fill="#f59e0b" />
                <path d="M4 8h16M4 16h16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="8" r="3" fill="#ffffff" />
                <circle cx="9" cy="8" r="1.5" fill="#d97706" />
                <circle cx="15" cy="16" r="3" fill="#ffffff" />
                <circle cx="15" cy="16" r="1.5" fill="#d97706" />
                <path d="M9 8v8l6-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
        );
    }

    // 28. Cron Jobs & Sweepers - Clock with Precision Sweep in Sky Blue
    if (lower.includes('cron') || lower.includes('sweeper')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <circle cx="12" cy="12" r="11" fill="#0284c7" />
                <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                <path d="M12 6.5v5.5l3.5 2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <path d="M18.5 5.5l-2.5 2.5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }

    // 29. REST API Architecture - Connected Endpoints in Violet
    if (lower.includes('rest api') || lower.includes('api architecture') || lower.includes('architecture')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="5" fill="#6366f1" />
                <path d="M6 12h12M14 8l4 4-4 4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="6" cy="12" r="2.5" fill="#ffffff" />
            </svg>
        );
    }

    // 30. Responsive Layouts - Multi-Device Viewports in Electric Blue
    if (lower.includes('responsive') || lower.includes('layout')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect x="2" y="3" width="20" height="13" rx="2" stroke="#2563eb" strokeWidth="2" fill="none" />
                <path d="M8 20h8M12 16v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                <rect x="14" y="8" width="6" height="9" rx="1.5" fill="#2563eb" />
                <circle cx="17" cy="15.5" r="0.75" fill="#ffffff" />
            </svg>
        );
    }

    // 31. State Management - Atom Dispatch Graph in Vivid Purple
    if (lower.includes('state')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <circle cx="12" cy="12" r="10.5" fill="#8b5cf6" />
                <circle cx="12" cy="6" r="2" fill="#ffffff" />
                <circle cx="6.5" cy="16.5" r="2" fill="#ffffff" />
                <circle cx="17.5" cy="16.5" r="2" fill="#ffffff" />
                <circle cx="12" cy="12" r="2.5" fill="#facc15" />
                <path d="M12 6l5.5 10.5H6.5z" stroke="#ffffff" strokeWidth="1.2" fill="none" />
            </svg>
        );
    }

    // 32. Fetch / Axios API (Official Axios Logo in #5A29E4)
    if (lower.includes('fetch') || lower.includes('axios')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="#5A29E4">
                <path d="M11.0683 2.89968V22.2973l-2.11399 1.70265V7.8638H4.975l6.0933-4.96412zM14.93426 0v15.76724H19.025l-6.20044 5.08865V1.4689L14.93426 0z" />
            </svg>
        );
    }

    // 33. Relational Data Modeling - ER Schema Linked Tables in Cyan-Blue
    if (lower.includes('relational') || lower.includes('modeling')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect x="2" y="3" width="9" height="7" rx="1.5" fill="#0284c7" />
                <rect x="13" y="14" width="9" height="7" rx="1.5" fill="#0284c7" />
                <path d="M6.5 10v6.5h6.5M10.5 18.5l2.5-2-2.5-2" stroke="#0284c7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    // 34. Multi-Tenant Scoping - Isolated Tenant Silos in Teal-Blue
    if (lower.includes('multi-tenant') || lower.includes('scoping') || lower.includes('tenant')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect x="2" y="6" width="9" height="15" rx="2" fill="#0891b2" />
                <rect x="13" y="3" width="9" height="18" rx="2" fill="#0284c7" />
                <circle cx="6.5" cy="10" r="1.5" fill="#ffffff" />
                <circle cx="6.5" cy="15" r="1.5" fill="#ffffff" />
                <circle cx="17.5" cy="7.5" r="1.5" fill="#ffffff" />
                <circle cx="17.5" cy="12" r="1.5" fill="#ffffff" />
                <circle cx="17.5" cy="16.5" r="1.5" fill="#ffffff" />
            </svg>
        );
    }

    // 35. Database Migrations - Sync Schema Changes in Emerald-Teal
    if (lower.includes('migration')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <ellipse cx="12" cy="6" rx="8" ry="3" fill="#0d9488" />
                <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="#0d9488" strokeWidth="2" fill="none" />
                <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#0d9488" strokeWidth="2" fill="none" />
                <path d="M12 9l3 3-3 3M15 12H9" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    // 36. Schema Indexing - B-Tree Fast Index Query in Deep Blue
    if (lower.includes('indexing') || lower.includes('index')) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
                <rect width="24" height="24" rx="5" fill="#1d4ed8" />
                <path d="M13 2L4 13h6l-2 9 10-12h-6l3-8z" fill="#facc15" />
            </svg>
        );
    }

    // Default Fallback
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 text-slate-400 ${className}`} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    );
};
