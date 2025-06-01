exports.generateHarvardJournalCitation = (article) => {
  // Validate required fields
  if (!article.authors || !article.year || !article.title || !article.journal) {
    throw new Error('Missing required fields: authors, year, title, and journal are required');
  }

  let citation = '';

  // Format authors (Harvard style)
  const formattedAuthors = formatHarvardAuthors(article.authors);
  citation += formattedAuthors;

  // Add year in parentheses
  citation += ` (${article.year})`;

  // Add title in single quotes with title case
  citation += ` '${formatHarvardTitle(article.title)}'`;

  // Add journal name (italicized)
  citation += `, *${article.journal}*`;

  // Add volume in italics
  if (article.volume) {
    citation += `, vol. *${article.volume}*`;
  }

  // Add issue number (not italicized)
  if (article.issue) {
    citation += `, no. ${article.issue}`;
  }

  // Add page range with 'pp.'
  if (article.pages) {
    citation += `, pp. ${formatHarvardPages(article.pages)}`;
  }

  // Add DOI or URL if available
  if (article.doi) {
    const cleanDoi = article.doi.replace('doi:', '').replace('https://doi.org/', '');
    citation += `, doi: ${cleanDoi}`;
  } else if (article.url) {
    citation += `, viewed ${getCurrentDate()}, <${article.url}>`;
  }

  citation += '.';

  return citation;
}

function formatHarvardAuthors(authors) {
  if (typeof authors === 'string') {
    authors = [authors];
  }

  if (authors.length === 1) {
    return formatHarvardSingleAuthor(authors[0], true);
  } else if (authors.length === 2) {
    return `${formatHarvardSingleAuthor(authors[0], true)} & ${formatHarvardSingleAuthor(authors[1], false)}`;
  } else if (authors.length === 3) {
    return `${formatHarvardSingleAuthor(authors[0], true)}, ${formatHarvardSingleAuthor(authors[1], false)} & ${formatHarvardSingleAuthor(authors[2], false)}`;
  } else {
    // 4+ authors: First author et al.
    return `${formatHarvardSingleAuthor(authors[0], true)} et al.`;
  }
}

function formatHarvardSingleAuthor(author, isFirst) {
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
      
      if (isFirst) {
        // First author: "Last, F.M."
        let initials = firstName.charAt(0).toUpperCase() + '.';
        if (author.authors_middlename && author.authors_middlename.trim()) {
          const middleName = author.authors_middlename.trim();
          initials += middleName.charAt(0).toUpperCase() + '.';
        }
        return `${lastName}, ${initials}`;
      } else {
        // Subsequent authors: "F.M. Last"
        let initials = firstName.charAt(0).toUpperCase() + '.';
        if (author.authors_middlename && author.authors_middlename.trim()) {
          const middleName = author.authors_middlename.trim();
          initials += middleName.charAt(0).toUpperCase() + '.';
        }
        return `${initials} ${lastName}`;
      }
    }
    // Handle legacy format
    else if (author.last && author.first) {
      if (isFirst) {
        const initials = author.first.split(' ')
          .map(name => name.charAt(0).toUpperCase() + '.')
          .join('');
        return `${author.last}, ${initials}`;
      } else {
        const initials = author.first.split(' ')
          .map(name => name.charAt(0).toUpperCase() + '.')
          .join('');
        return `${initials} ${author.last}`;
      }
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
      const initials = firstNames.map(name => name.charAt(0).toUpperCase() + '.').join('');
      
      if (isFirst) {
        return `${lastName}, ${initials}`;
      } else {
        return `${initials} ${lastName}`;
      }
    }
    return author;
  }
  
  console.warn('Unexpected author format:', typeof author, author);
  return '[Unknown Author Format]';
}

function formatHarvardTitle(title) {
  // Harvard uses title case (capitalize all major words)
  return title
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      // Always capitalize first and last word
      if (index === 0 || index === array.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      // Don't capitalize articles, prepositions, conjunctions (unless first/last word)
      const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
      
      if (lowercaseWords.includes(word.toLowerCase()) && word.length <= 4) {
        return word.toLowerCase();
      }
      
      // Capitalize all other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/:\s*\w/g, match => match.toUpperCase()) // Capitalize after colons
    .replace(/-\w/g, match => match.toUpperCase()); // Capitalize after hyphens
}

function formatHarvardPages(pages) {
  if (typeof pages === 'string') {
    // Remove any existing 'p.' or 'pp.' prefix
    let cleaned = pages.replace(/^pp?\.\s*/, '');
    
    // Harvard uses en-dash for page ranges
    cleaned = cleaned.replace(/\s*-\s*/g, '-');
    
    return cleaned;
  }
  return pages;
}

function getCurrentDate() {
  // Format: day month year (e.g., "25 May 2025")
  const date = new Date();
  const day = date.getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

// Function to generate in-text citation
function generateHarvardInText(article) {
  if (!article.authors || !article.year) {
    throw new Error('Missing required fields for in-text citation: authors and year are required');
  }

  const authors = Array.isArray(article.authors) ? article.authors : [article.authors];
  
  if (authors.length === 1) {
    const author = formatHarvardSingleAuthor(authors[0], true);
    const authorName = author.split(',')[0]; // Get just the last name
    return `(${authorName} ${article.year})`;
  } else if (authors.length === 2) {
    const author1 = formatHarvardSingleAuthor(authors[0], true).split(',')[0];
    const author2 = formatHarvardSingleAuthor(authors[1], false).split(' ').pop();
    return `(${author1} & ${author2} ${article.year})`;
  } else {
    const firstAuthor = formatHarvardSingleAuthor(authors[0], true).split(',')[0];
    return `(${firstAuthor} et al. ${article.year})`;
  }
}






