import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles for Professional template
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2 solid #2563eb',
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1e40af',
    },
    contactInfo: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 3,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1e40af',
        borderBottom: '1 solid #cbd5e1',
        paddingBottom: 3,
    },
    experienceItem: {
        marginBottom: 10,
    },
    jobTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    company: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 2,
    },
    date: {
        fontSize: 9,
        color: '#94a3b8',
        marginBottom: 4,
    },
    description: {
        fontSize: 10,
        lineHeight: 1.4,
        color: '#475569',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skill: {
        backgroundColor: '#e0e7ff',
        color: '#3730a3',
        padding: '4 8',
        borderRadius: 3,
        fontSize: 9,
    },
    summary: {
        fontSize: 10,
        lineHeight: 1.5,
        color: '#475569',
        marginBottom: 15,
    },
});

interface ResumePDFProps {
    userData: any;
    resumeData: any;
}

export function ProfessionalTemplate({ userData, resumeData }: ResumePDFProps) {
    const selectedExperiences = userData.workExperience.filter((exp: any) =>
        resumeData.selectedExp?.includes(exp.id)
    );

    const selectedEducation = userData.education.filter((edu: any) =>
        resumeData.selectedEdu?.includes(edu.id)
    );

    const selectedSkills = userData.skills.filter((skill: any) =>
        resumeData.customSkills?.includes(skill.id)
    );

    const selectedCerts = userData.certifications.filter((cert: any) =>
        resumeData.selectedCerts?.includes(cert.id)
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{userData.name || 'Your Name'}</Text>
                    {userData.profile?.headline && (
                        <Text style={styles.contactInfo}>{userData.profile.headline}</Text>
                    )}
                    {userData.email && (
                        <Text style={styles.contactInfo}>{userData.email}</Text>
                    )}
                    {userData.profile?.phone && (
                        <Text style={styles.contactInfo}>{userData.profile.phone}</Text>
                    )}
                </View>

                {/* Professional Summary */}
                {resumeData.customSummary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.summary}>{resumeData.customSummary}</Text>
                    </View>
                )}

                {/* Work Experience */}
                {selectedExperiences.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Work Experience</Text>
                        {selectedExperiences.map((exp: any) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <Text style={styles.jobTitle}>{exp.title}</Text>
                                <Text style={styles.company}>{exp.company}</Text>
                                <Text style={styles.date}>
                                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                                    {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </Text>
                                {exp.description && (
                                    <Text style={styles.description}>{exp.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {selectedEducation.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {selectedEducation.map((edu: any) => (
                            <View key={edu.id} style={styles.experienceItem}>
                                <Text style={styles.jobTitle}>{edu.degree}</Text>
                                <Text style={styles.company}>{edu.institution}</Text>
                                <Text style={styles.date}>
                                    {edu.fieldOfStudy && `${edu.fieldOfStudy} • `}
                                    {new Date(edu.startDate).getFullYear()} -{' '}
                                    {edu.isCurrent ? 'Present' : new Date(edu.endDate).getFullYear()}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {selectedSkills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={styles.skillsContainer}>
                            {selectedSkills.map((skill: any) => (
                                <Text key={skill.id} style={styles.skill}>
                                    {skill.name}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Certifications */}
                {selectedCerts.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {selectedCerts.map((cert: any) => (
                            <View key={cert.id} style={styles.experienceItem}>
                                <Text style={styles.jobTitle}>{cert.name}</Text>
                                <Text style={styles.company}>
                                    {cert.issuingOrg} • {new Date(cert.issueDate).getFullYear()}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
}
