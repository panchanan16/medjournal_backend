export function generateAPAJournalCitation(article) {
  // Validate required fields
  if (!article.authors || !article.year || !article.title || !article.journal) {
    throw new Error('Missing required fields: authors, year, title, and journal are required');
  }

  let citation = '';

  // Format authors
  const formattedAuthors = formatAuthors(article.authors);
  citation += formattedAuthors;

  // Add year in parentheses
  citation += ` (${article.year}).`;

  // Add title (sentence case, no quotes)
  citation += ` ${formatTitle(article.title)}.`;

  // Add journal name (italicized) and volume
  citation += ` *${article.journal}*`;
  
  if (article.volume) {
    citation += `, *${article.volume}*`;
  }

  // Add issue number in parentheses (not italicized)
  if (article.issue) {
    citation += `(${article.issue})`;
  }

  // Add page range
  if (article.pages) {
    citation += `, ${formatPages(article.pages)}`;
  }

  // Add DOI or URL if available
  if (article.doi) {
    citation += `. https://doi.org/${article.doi.replace('doi:', '').replace('https://doi.org/', '')}`;
  } else if (article.url) {
    citation += `. ${article.url}`;
  }

  citation += '.';

  return citation;
}

function formatAuthors(authors) {
  if (typeof authors === 'string') {
    // If single author as string, convert to array
    authors = [authors];
  }

  if (authors.length === 1) {
    return formatSingleAuthor(authors[0]);
  } else if (authors.length === 2) {
    return `${formatSingleAuthor(authors[0])}, & ${formatSingleAuthor(authors[1])}`;
  } else if (authors.length <= 20) {
    const formatted = authors.slice(0, -1).map(formatSingleAuthor).join(', ');
    return `${formatted}, & ${formatSingleAuthor(authors[authors.length - 1])}`;
  } else {
    // For 21+ authors, list first 19, then "...", then last author
    const first19 = authors.slice(0, 19).map(formatSingleAuthor).join(', ');
    return `${first19}, ... ${formatSingleAuthor(authors[authors.length - 1])}`;
  }
}

function formatSingleAuthor(author) {
  // Handle null, undefined, or invalid objects
  if (!author) {
    console.warn('Invalid author object:', author);
    return '[Invalid Author]';
  }

  if (typeof author === 'object') {
    // Handle new author object format
    if (author.authors_lastname && author.authors_name) {
      let formatted = `${author.authors_lastname.trim()}, `;
      
      // Add first name initial
      const firstName = author.authors_name.trim();
      formatted += `${firstName.charAt(0).toUpperCase()}.`;
      
      // Add middle name initial if present
      if (author.authors_middlename && author.authors_middlename.trim()) {
        const middleName = author.authors_middlename.trim();
        // Remove existing period if present
        const middleInitial = middleName.replace('.', '').charAt(0).toUpperCase();
        formatted += ` ${middleInitial}.`;
      }
      
      return formatted;
    }
    // Handle legacy format
    else if (author.last && author.first) {
      const initials = author.first.split(' ')
        .map(name => name.charAt(0).toUpperCase() + '.')
        .join(' ');
      return `${author.last}, ${initials}`;
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
      const initials = firstNames.map(name => name.charAt(0).toUpperCase() + '.').join(' ');
      return `${lastName}, ${initials}`;
    }
    return author; // Return as-is if can't parse
  }
  
  console.warn('Unexpected author format:', typeof author, author);
  return '[Unknown Author Format]';
}

function formatTitle(title) {
  // Convert to sentence case (only first word and proper nouns capitalized)
  // This is a simplified version - in practice, you'd want more sophisticated capitalization rules
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
    .replace(/\b[A-Z]{2,}\b/g, match => match.toUpperCase()) // Keep acronyms
    .replace(/:\s*\w/g, match => match.toUpperCase()); // Capitalize after colons
}

function formatPages(pages) {
  if (typeof pages === 'string') {
    return pages.replace(/^pp?\.\s*/, ''); // Remove 'p.' or 'pp.' prefix if present
  }
  return pages;
}




