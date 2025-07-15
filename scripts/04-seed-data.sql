-- Insert sample global threat intelligence data (organization_id = NULL for global threats)
INSERT INTO public.threat_intelligence (organization_id, threat_type, title, description, severity, source, published_at) VALUES
(NULL, 'CVE', 'Critical SQL Injection in Popular CMS', 'A critical SQL injection vulnerability has been discovered in a widely-used content management system affecting millions of websites. Immediate patching is recommended.', 'Critical', 'NIST NVD', NOW() - INTERVAL '2 days'),
(NULL, 'Malware', 'New Ransomware Targeting SMEs', 'Security researchers have identified a new ransomware strain specifically targeting small and medium enterprises through phishing emails. The malware encrypts critical business files and demands payment in cryptocurrency.', 'High', 'Cybersecurity Research Firm', NOW() - INTERVAL '1 day'),
(NULL, 'Phishing', 'Increase in Business Email Compromise', 'There has been a 300% increase in business email compromise attacks targeting financial departments of SMEs. Attackers are using sophisticated social engineering techniques.', 'High', 'FBI IC3', NOW() - INTERVAL '3 days'),
(NULL, 'Vulnerability', 'Zero-Day in Popular Web Framework', 'A zero-day vulnerability has been discovered in a widely-used web application framework. The vulnerability allows remote code execution and affects versions 2.0 through 3.5.', 'Critical', 'Security Advisory', NOW() - INTERVAL '5 days'),
(NULL, 'Threat Actor', 'APT Group Targeting Healthcare', 'Advanced Persistent Threat group has been observed targeting healthcare organizations with custom malware designed to steal patient data and disrupt operations.', 'High', 'Threat Intelligence Report', NOW() - INTERVAL '1 week');

-- Note: Sample vulnerabilities and other data will be created when users start using the application
-- This ensures proper organization association and user permissions
