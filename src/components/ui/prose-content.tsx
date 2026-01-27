import { cn } from "@/lib/utils";

interface ProseContentProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * ProseContent - Unified typography wrapper for all spoke page content
 * Ensures consistent heading styles, paragraph spacing, and element styling
 */
export function ProseContent({ children, className }: ProseContentProps) {
    return (
        <article className={cn(
            // Base typography
            "prose-content",
            "text-[#4A5568]",

            // Headings
            "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#003554] [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:tracking-tight",
            "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#003554] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:tracking-tight [&_h2]:border-b [&_h2]:border-[#006494]/10 [&_h2]:pb-2",
            "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#003554] [&_h3]:mb-3 [&_h3]:mt-6",
            "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#003554] [&_h4]:mb-2 [&_h4]:mt-4",

            // Paragraphs
            "[&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-[#4A5568]",

            // Lists
            "[&_ul]:space-y-2 [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:list-disc",
            "[&_ol]:space-y-2 [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:list-decimal",
            "[&_li]:text-[#4A5568] [&_li]:leading-relaxed",

            // Links
            "[&_a]:text-[#0582CA] [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-[#003554] [&_a]:transition-colors",

            // Blockquotes
            "[&_blockquote]:border-l-4 [&_blockquote]:border-[#FFC300] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#6B7280] [&_blockquote]:my-6",

            // Code
            "[&_code]:bg-[#F0F4F8] [&_code]:text-[#003554] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",

            // Tables
            "[&_table]:w-full [&_table]:text-left [&_table]:border-collapse [&_table]:my-6",
            "[&_th]:bg-[#003554] [&_th]:text-white [&_th]:px-4 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-sm",
            "[&_td]:border-b [&_td]:border-[#E5E7EB] [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm",
            "[&_tr:hover]:bg-[#F0F4F8]/50",

            // Strong/Bold
            "[&_strong]:font-bold [&_strong]:text-[#003554]",

            // Horizontal rules
            "[&_hr]:border-t [&_hr]:border-[#E5E7EB] [&_hr]:my-8",

            className
        )}>
            {children}
        </article>
    );
}

/**
 * ContentSection - Unified section wrapper with consistent spacing
 */
interface ContentSectionProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function ContentSection({ children, className, title, description }: ContentSectionProps) {
    return (
        <section className={cn("mb-12", className)}>
            {title && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#003554] tracking-tight border-b border-[#006494]/10 pb-2">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-[#6B7280] mt-2">{description}</p>
                    )}
                </div>
            )}
            {children}
        </section>
    );
}

/**
 * ContentCard - Unified card style for content modules
 */
interface ContentCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function ContentCard({ children, className, hover = true }: ContentCardProps) {
    return (
        <div className={cn(
            "bg-white rounded-xl shadow-md border border-[#006494]/10 p-6",
            hover && "hover:shadow-lg transition-shadow duration-300",
            className
        )}>
            {children}
        </div>
    );
}

/**
 * FeatureCard - Colored gradient card for highlights
 */
interface FeatureCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'blue' | 'gold' | 'teal';
}

export function FeatureCard({ children, className, variant = 'blue' }: FeatureCardProps) {
    const gradientMap = {
        blue: "from-[#003554]/5 to-transparent border-[#006494]/10",
        gold: "from-[#FFC300]/10 to-transparent border-[#FFC300]/20",
        teal: "from-[#00A6FB]/10 to-transparent border-[#0582CA]/20"
    };

    return (
        <div className={cn(
            "bg-gradient-to-br rounded-xl p-6 border",
            gradientMap[variant],
            className
        )}>
            {children}
        </div>
    );
}

/**
 * DataTable - Consistent table styling
 */
interface DataTableProps {
    headers: string[];
    rows: (string | React.ReactNode)[][];
    className?: string;
}

export function DataTable({ headers, rows, className }: DataTableProps) {
    return (
        <div className={cn("overflow-x-auto my-6 rounded-lg border border-[#E5E7EB]", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#003554]">
                        {headers.map((header, idx) => (
                            <th key={idx} className="px-4 py-3 font-semibold text-sm text-white">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-[#F0F4F8]/50 transition-colors">
                            {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="border-b border-[#E5E7EB] px-4 py-3 text-sm text-[#4A5568]">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
