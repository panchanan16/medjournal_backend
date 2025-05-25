-- about us table
CREATE TABLE about_us (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);


-- indexing table
CREATE TABLE index_ing (
    ind_id INT AUTO_INCREMENT PRIMARY KEY,
    index_name VARCHAR(255) NOT NULL,
    link VARCHAR(800) NOT NULL,
    imgUrl VARCHAR(500) DEFAULT NULL,
    isDisplay BOOLEAN DEFAULT TRUE
);

-- announcement table
CREATE TABLE announcement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    heading VARCHAR(500) NOT NULL,
    content MEDIUMTEXT NOT NULL
);


-- news table
CREATE TABLE our_news (
    news_id INT AUTO_INCREMENT PRIMARY KEY,
    heading VARCHAR(500) NOT NULL,
    content MEDIUMTEXT NOT NULL
);

-- adpolicy table
CREATE TABLE adpolicy (
    ad_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);


-- supplement table
CREATE TABLE supplement_series (
    ss_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);


-- peer review table
CREATE TABLE review_process (
    prp_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);


-- Article charge table
CREATE TABLE article_charges (
    ac_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);

-- Policy Table
CREATE TABLE policy (
  pol_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  content MEDIUMTEXT DEFAULT NULL,
  pageUrl VARCHAR(255) NOT NULL UNIQUE,
  redirectLink VARCHAR(255) DEFAULT NULL
);


-- volume table
CREATE TABLE volume (
    volume_id INT AUTO_INCREMENT PRIMARY KEY,
    volume_name VARCHAR(255) NOT NULL,
    volume_img VARCHAR(300) DEFAULT NULL,
    volume_year VARCHAR(20) DEFAULT NULL
);


------------- ISSUE SECTION --------------


-- standard issue table 
CREATE TABLE vol_issue (
    is_id INT AUTO_INCREMENT PRIMARY KEY,
    volume_id INT NOT NULL,
    issue_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (volume_id) REFERENCES volume(volume_id)
);

--- special issue table
CREATE TABLE special_issues (
    sp_issue_id INT AUTO_INCREMENT PRIMARY KEY,
    issueId INT NOT NULL,
    isSpecial BOOLEAN DEFAULT FALSE,
    isPublished BOOLEAN DEFAULT FALSE,
    publish_date VARCHAR(80) DEFAULT NULL,
    submission_deadline VARCHAR(80) DEFAULT NULL,
    issueCoverImgUrl VARCHAR(500),
    special_issue_title VARCHAR(255) NOT NULL,
    special_issue_about MEDIUMTEXT,
    FOREIGN KEY (issueId) REFERENCES vol_issue(is_id) ON DELETE CASCADE
);


---- special issue authors ----------

CREATE TABLE special_authors (
    sp_auth_id INT AUTO_INCREMENT PRIMARY KEY,
    issueId INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    orchid_id VARCHAR(100),
    afflication TEXT DEFAULT NULL,
    qualification TEXT DEFAULT NULL,
    FOREIGN KEY (issueId) REFERENCES vol_issue(is_id) ON DELETE CASCADE
);




-- editor board table
CREATE TABLE editor_board (
    editor_id INT AUTO_INCREMENT PRIMARY KEY,
    editor_type VARCHAR(200) NOT NULL,
    name VARCHAR(255) NOT NULL,
    qualification TEXT DEFAULT NULL,
    designation TEXT DEFAULT NULL,
    institution TEXT DEFAULT NULL,
    biography MEDIUMTEXT DEFAULT NULL,
    imgLink VARCHAR(500) DEFAULT NULL
);



-------------- Article Work -----------------

CREATE TABLE article_main (
    ariticle_id INT AUTO_INCREMENT PRIMARY KEY,
    isInHome BOOLEAN,
    isOpenaccess BOOLEAN,
    isInPress BOOLEAN DEFAULT 0,
    isMostRead BOOLEAN DEFAULT 0,
    isNihFunded BOOLEAN DEFAULT 0,
    issueNo INT NOT NULL,
    url TEXT,
    articleType VARCHAR(100),
    title TEXT,
    DOI VARCHAR(100),
    DOIlink TEXT,
    PMID VARCHAR(50),
    PMID_Link TEXT,
    abstract TEXT,
    page_from VARCHAR(10),
    page_to VARCHAR(10),
    keywords TEXT,
    how_to_cite TEXT,
    recieve_date VARCHAR(50),
    Revised_date VARCHAR(50),
    Accepted_date VARCHAR(50),
    published_date VARCHAR(50),
    available_date VARCHAR(50),
    Downloads INT,
    Views INT,
    pdflink TEXT,
    xmllink TEXT,
    citation_apa TEXT,
    citation_mla TEXT,
    citation_chicago TEXT,
    citation_harvard TEXT,
    citation_vancouver TEXT,
    FOREIGN KEY (issueNo) REFERENCES vol_issue(is_id) ON DELETE CASCADE
);


CREATE TABLE article_details (
    ad_id INT AUTO_INCREMENT PRIMARY KEY,
    ariticle_id INT NOT NULL,
    Article_Heading TEXT,
    article_content TEXT,
    FOREIGN KEY (ariticle_id) REFERENCES article_main(ariticle_id) ON DELETE CASCADE
);


CREATE TABLE article_authors (
    ar_author_id INT AUTO_INCREMENT PRIMARY KEY,
    ariticle_id INT NOT NULL,
    authors_prefix VARCHAR(100) DEFAULT NULL,
    authors_name VARCHAR(200),
    authors_middlename VARCHAR(200) DEFAULT NULL,
    authors_lastname VARCHAR(200) DEFAULT NULL,
    author_email VARCHAR(250) DEFAULT NULL,
    orchid_id VARCHAR(300) DEFAULT NULL,
    afflication TEXT DEFAULT NULL,
    qualification TEXT DEFAULT NULL,
    FOREIGN KEY (ariticle_id) REFERENCES article_main(ariticle_id) ON DELETE CASCADE
);



-- Home page details

CREATE TABLE journal_info (
    j_id INT AUTO_INCREMENT PRIMARY KEY,
    journal_name VARCHAR(255),
    abb_name VARCHAR(200),
    subjects TEXT,
    journal_url TEXT,
    issn_print VARCHAR(100),
    issn_online VARCHAR(100),
    email VARCHAR(150),
    thumbnail TEXT,
    about TEXT,
    aim_scope TEXT,
    Porocess_charge VARCHAR(100),
    cite_score VARCHAR(100),
    cite_score_link TEXT,
    impact_factor VARCHAR(100),
    impact_factor_link TEXT,
    accepted_rate VARCHAR(100),
    time_first_desicision VARCHAR(200),
    acceptance_to_publication VARCHAR(50),
    review_time VARCHAR(100),
    logo_journal TEXT
);


-- Online first table
CREATE TABLE onlinefirst (
    of_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);



-- Ethics And Policies ---
CREATE TABLE policies (
    pol_id INT AUTO_INCREMENT PRIMARY KEY,
    policy_name VARCHAR(255) NOT NULL,
    content TEXT,
    url VARCHAR(500)
);



--- Review tables -----


CREATE TABLE review_main (
    revlist_id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT DEFAULT NULL,
    postedOn VARCHAR(100) DEFAULT NULL
);

CREATE TABLE reviewer_list (
    r_id INT AUTO_INCREMENT PRIMARY KEY,
    rev_id INT NOT NULL,
    month VARCHAR(20) DEFAULT NULL,
    year VARCHAR(10) DEFAULT NULL,
    name VARCHAR(255) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    university VARCHAR(255) DEFAULT NULL,
    biography TEXT DEFAULT NULL,
    FOREIGN KEY (rev_id) REFERENCES review_main(revlist_id) ON DELETE CASCADE ON UPDATE CASCADE
);



----- Author Instruction -------

CREATE TABLE author_instruction (
  ai_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content MEDIUMTEXT NOT NULL
);


---- Site Settings -----

CREATE TABLE site_settings (
    settings_id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    submissionEmail VARCHAR(100),
    supportEmail VARCHAR(100),
    FooterCopyright VARCHAR(500),
    AboutUs MEDIUMTEXT,
    ContactUs MEDIUMTEXT,
    PrivacyPolicy MEDIUMTEXT,
    TermsCondition MEDIUMTEXT,
    Copyright MEDIUMTEXT,
    CookiePrefer MEDIUMTEXT
);


----- Main JOurnal ------

CREATE TABLE main_journals (
  mj_id INT AUTO_INCREMENT PRIMARY KEY,
  journal_name VARCHAR(255),
  tagline VARCHAR(500) DEFAULT NULL,
  abbreviation_name VARCHAR(255),
  subjects TEXT,
  issn_print VARCHAR(120),
  issn_online VARCHAR(120),
  email VARCHAR(100),
  thumbnail VARCHAR(255),
  about MEDIUMTEXT,
  aim_scope MEDIUMTEXT,
  processingCharge VARCHAR(100),
  cite_score VARCHAR(150),
  cite_score_link VARCHAR(255),
  impact_factor VARCHAR(150),
  impact_factor_link VARCHAR(255),
  accepted_rate VARCHAR(150),
  time_first_decision VARCHAR(150),
  acceptance_to_publication VARCHAR(150),
  review_time VARCHAR(150),
  logo_journal VARCHAR(255)
);


--- Review Guideline ----


CREATE TABLE review_guideline (
    rg_id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    content MEDIUMTEXT DEFAULT NULL
);



---- Article Submission table ------

CREATE TABLE manuscripts (
    manu_id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(150) DEFAULT NULL,
    pay_status VARCHAR(150) DEFAULT NULL,
    user INT NOT NULL,
    MRN_number VARCHAR(150) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    manuscript_title TEXT DEFAULT NULL,
    abstract TEXT DEFAULT NULL,
    keywords TEXT DEFAULT NULL,
    article_file VARCHAR(255) DEFAULT NULL,
    acceptance_letter VARCHAR(255) DEFAULT NULL,
    invoice VARCHAR(255) DEFAULT NULL,
    additional_file VARCHAR(255) DEFAULT NULL,
    editorial_comment TEXT DEFAULT NULL,
    published_link VARCHAR(255) DEFAULT NULL,
    isReminder BOOLEAN DEFAULT NULL,
    submitted_on VARCHAR(100) DEFAULT NULL,
    updated_on VARCHAR(100) DEFAULT NULL
);




------ slider contents -------

CREATE TABLE sliders (
    slider_id INT AUTO_INCREMENT PRIMARY KEY,
    slide_title VARCHAR(255) NOT NULL,
    slider_desc TEXT,
    slider_link VARCHAR(500),
    slider_img VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



--- Submit Multimedia Table ----

CREATE TABLE multimedia_process (
    mul_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);



--- Refference style Table ----

CREATE TABLE reffer_style (
    ref_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL
);




---- featuredBlogs table ---------

CREATE TABLE featuredblogs (
  blog_id INT AUTO_INCREMENT PRIMARY KEY,
  blog_title VARCHAR(255) NOT NULL,
  blog_thumbnail VARCHAR(255) DEFAULT NULL,
  blog_details MEDIUMTEXT NOT NULL,
  posted_on VARCHAR(200) DEFAULT NULL
);






ALTER TABLE article_main ADD COLUMN isMostRead BOOLEAN DEFAULT 0 AFTER isInPress; 


ALTER TABLE article_main ADD COLUMN isNihFunded BOOLEAN DEFAULT 0 AFTER isMostRead; 



















