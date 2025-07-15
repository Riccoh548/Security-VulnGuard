-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Organizations policies
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Organization owners can update their organizations" ON public.organizations;
CREATE POLICY "Organization owners can update their organizations" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Organization members policies
DROP POLICY IF EXISTS "Users can view organization members" ON public.organization_members;
CREATE POLICY "Users can view organization members" ON public.organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage organization members" ON public.organization_members;
CREATE POLICY "Users can manage organization members" ON public.organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can join organizations" ON public.organization_members;
CREATE POLICY "Users can join organizations" ON public.organization_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Assets policies
DROP POLICY IF EXISTS "Users can view organization assets" ON public.assets;
CREATE POLICY "Users can view organization assets" ON public.assets
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage organization assets" ON public.assets;
CREATE POLICY "Users can manage organization assets" ON public.assets
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Scans policies
DROP POLICY IF EXISTS "Users can view organization scans" ON public.scans;
CREATE POLICY "Users can view organization scans" ON public.scans
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage organization scans" ON public.scans;
CREATE POLICY "Users can manage organization scans" ON public.scans
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Vulnerabilities policies
DROP POLICY IF EXISTS "Users can view organization vulnerabilities" ON public.vulnerabilities;
CREATE POLICY "Users can view organization vulnerabilities" ON public.vulnerabilities
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage organization vulnerabilities" ON public.vulnerabilities;
CREATE POLICY "Users can manage organization vulnerabilities" ON public.vulnerabilities
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Vulnerability comments policies
DROP POLICY IF EXISTS "Users can view vulnerability comments" ON public.vulnerability_comments;
CREATE POLICY "Users can view vulnerability comments" ON public.vulnerability_comments
  FOR SELECT USING (
    vulnerability_id IN (
      SELECT id FROM public.vulnerabilities 
      WHERE organization_id IN (
        SELECT organization_id FROM public.organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can create vulnerability comments" ON public.vulnerability_comments;
CREATE POLICY "Users can create vulnerability comments" ON public.vulnerability_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    vulnerability_id IN (
      SELECT id FROM public.vulnerabilities 
      WHERE organization_id IN (
        SELECT organization_id FROM public.organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- AI chat sessions policies
DROP POLICY IF EXISTS "Users can view own chat sessions" ON public.ai_chat_sessions;
CREATE POLICY "Users can view own chat sessions" ON public.ai_chat_sessions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own chat sessions" ON public.ai_chat_sessions;
CREATE POLICY "Users can manage own chat sessions" ON public.ai_chat_sessions
  FOR ALL USING (user_id = auth.uid());

-- Threat intelligence policies
DROP POLICY IF EXISTS "Users can view organization threat intelligence" ON public.threat_intelligence;
CREATE POLICY "Users can view organization threat intelligence" ON public.threat_intelligence
  FOR SELECT USING (
    organization_id IS NULL OR -- Global threat intelligence
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage organization threat intelligence" ON public.threat_intelligence;
CREATE POLICY "Users can manage organization threat intelligence" ON public.threat_intelligence
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
