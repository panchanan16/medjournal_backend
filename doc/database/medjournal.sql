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


-- volume table
CREATE TABLE volume (
    volume_id INT AUTO_INCREMENT PRIMARY KEY,
    volume_name VARCHAR(255) NOT NULL,
    volume_img VARCHAR(300) DEFAULT NULL,
    volume_year VARCHAR(20) DEFAULT NULL
);


-- issue table 
CREATE TABLE vol_issue (
    is_id INT AUTO_INCREMENT PRIMARY KEY,
    volume_id INT NOT NULL,
    issue_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (volume_id) REFERENCES volume(volume_id)
);


-- editor board table
CREATE TABLE editor_board (
    editor_id INT AUTO_INCREMENT PRIMARY KEY,
    editor_type VARCHAR(200) NOT NULL,
    name VARCHAR(255) NOT NULL,
    qualification TEXT DEFAULT NULL,
    designation TEXT DEFAULT NULL,
    institution TEXT DEFAULT NULL,
    imgLink VARCHAR(500) DEFAULT NULL
);


