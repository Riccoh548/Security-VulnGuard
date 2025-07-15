-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scans_updated_at BEFORE UPDATE ON public.scans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vulnerabilities_updated_at BEFORE UPDATE ON public.vulnerabilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT organization_id INTO org_id
  FROM public.organization_members
  WHERE user_id = user_uuid
  LIMIT 1;
  
  RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate security score
CREATE OR REPLACE FUNCTION public.calculate_security_score(org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_vulns INTEGER;
  critical_vulns INTEGER;
  high_vulns INTEGER;
  medium_vulns INTEGER;
  score INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_vulns
  FROM public.vulnerabilities
  WHERE organization_id = org_id AND status = 'open';
  
  SELECT COUNT(*) INTO critical_vulns
  FROM public.vulnerabilities
  WHERE organization_id = org_id AND status = 'open' AND severity = 'Critical';
  
  SELECT COUNT(*) INTO high_vulns
  FROM public.vulnerabilities
  WHERE organization_id = org_id AND status = 'open' AND severity = 'High';
  
  SELECT COUNT(*) INTO medium_vulns
  FROM public.vulnerabilities
  WHERE organization_id = org_id AND status = 'open' AND severity = 'Medium';
  
  -- Calculate score (100 - weighted vulnerability count)
  score := 100 - (critical_vulns * 20 + high_vulns * 10 + medium_vulns * 5);
  
  -- Ensure score is between 0 and 100
  IF score < 0 THEN
    score := 0;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
