export function generateVancouverJournalCitation(article, referenceNumber = null) {
  // Validate required fields
  if (!article.authors || !article.title || !article.journal || !article.year) {
    throw new Error('Missing required fields: authors, title, journal, and year are required');
  }

  let citation = '';

  // Add reference number if provided (for numbered reference system)
  if (referenceNumber !== null) {
    citation += `${referenceNumber}. `;
  }

  // Format authors (Vancouver style)
  const formattedAuthors = formatVancouverAuthors(article.authors);
  citation += formattedAuthors;

  // Add title (sentence case, no quotes)
  citation += ` ${formatVancouverTitle(article.title)}.`;

  // Add journal name (abbreviated if possible, no italics)
  citation += ` ${article.journal}`;

  // Add year, volume, issue, and pages in Vancouver format
  if (article.year) {
    citation += ` ${article.year}`;
  }

  if (article.volume) {
    citation += `;${article.volume}`;
  }

  if (article.issue) {
    citation += `(${article.issue})`;
  }

  if (article.pages) {
    citation += `:${formatVancouverPages(article.pages)}`;
  }

  // Add DOI if available
  if (article.doi) {
    const cleanDoi = article.doi.replace('doi:', '').replace('https://doi.org/', '');
    citation += `. doi: ${cleanDoi}`;
  }

  // Add URL if available and no DOI
  else if (article.url) {
    citation += `. Available from: ${article.url}`;
  }

  citation += '.';

  return citation;
}

function formatVancouverAuthors(authors) {
  if (typeof authors === 'string') {
    authors = [authors];
  }

  // Vancouver style: List up to 6 authors, then et al.
  if (authors.length <= 6) {
    return authors.map(formatVancouverSingleAuthor).join(', ');
  } else {
    // List first 6 authors, then et al.
    const first6 = authors.slice(0, 6).map(formatVancouverSingleAuthor).join(', ');
    return `${first6}, et al.`;
  }
}

function formatVancouverSingleAuthor(author) {
  // Handle null, undefined, or invalid objects
  if (!author) {
    console.warn('Invalid author object:', author);
    return '[Invalid Author]';
  }

  if (typeof author === 'object') {
    // Handle new author object format
    if (author.authors_lastname && author.authors_name) {
      const lastName = author.authors_lastname.trim();
      const firstName = author.authors_name.trim();
      
      // Vancouver format: "LastName FirstInitial MiddleInitial" (no spaces between initials)
      let initials = firstName.charAt(0).toUpperCase();
      
      if (author.authors_middlename && author.authors_middlename.trim()) {
        const middleName = author.authors_middlename.trim();
        initials += middleName.charAt(0).toUpperCase();
      }
      
      return `${lastName} ${initials}`;
    }
    // Handle legacy format
    else if (author.last && author.first) {
      const initials = author.first.split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .join('');
      return `${author.last} ${initials}`;
    }
    // Handle malformed objects
    else {
      console.warn('Malformed author object:', author);
      console.warn('Expected properties: authors_lastname, authors_name (new format) or last, first (legacy format)');
      return '[Malformed Author Object]';
    }
  } else if (typeof author === 'string') {
    // If author is a string, try to parse it
    const parts = author.trim().split(/\s+/);
    if (parts.length >= 2) {
      const lastName = parts[parts.length - 1];
      const firstNames = parts.slice(0, -1);
      const initials = firstNames.map(name => name.charAt(0).toUpperCase()).join('');
      return `${lastName} ${initials}`;
    }
    return author;
  }
  
  console.warn('Unexpected author format:', typeof author, author);
  return '[Unknown Author Format]';
}

function formatVancouverTitle(title) {
  // Vancouver uses sentence case (only first word and proper nouns capitalized)
  // This is a simplified version - proper implementation would need more sophisticated rules
  let formatted = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  
  // Keep acronyms uppercase
  formatted = formatted.replace(/\b[a-z]{2,4}\b/g, (match) => {
    // Check if it's likely an acronym (all caps in original)
    const originalWord = title.slice(title.toLowerCase().indexOf(match.toLowerCase()), 
                                   title.toLowerCase().indexOf(match.toLowerCase()) + match.length);
    if (originalWord === originalWord.toUpperCase() && originalWord.length <= 4) {
      return originalWord;
    }
    return match;
  });
  
  // Capitalize after colons
  formatted = formatted.replace(/:\s*\w/g, match => match.toUpperCase());
  
  return formatted;
}

function formatVancouverPages(pages) {
  if (typeof pages === 'string') {
    // Remove any existing 'p.' or 'pp.' prefix and clean format
    let cleaned = pages.replace(/^pp?\.\s*/, '');
    
    // Vancouver prefers page ranges without spaces around dash
    cleaned = cleaned.replace(/\s*-\s*/g, '-');
    
    return cleaned;
  }
  return pages;
}

// Function to generate multiple citations with reference numbers
function generateVancouverReferenceList(articles) {
  return articles.map((article, index) => 
    generateVancouverJournalCitation(article, index + 1)
  ).join('\n');
}




