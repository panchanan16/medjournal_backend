export function generateChicagoJournalCitation(article, style = 'notes') {
  // Validate required fields
  if (!article.authors || !article.title || !article.journal) {
    throw new Error('Missing required fields: authors, title, and journal are required');
  }

  if (style === 'notes') {
    return generateChicagoNotes(article);
  } else if (style === 'bibliography') {
    return generateChicagoBibliography(article);
  } else {
    throw new Error('Style must be either "notes" or "bibliography"');
  }
}

function generateChicagoNotes(article) {
  let citation = '';

  // Format authors for notes style
  const formattedAuthors = formatChicagoNotesAuthors(article.authors);
  citation += formattedAuthors;

  // Add title in quotes with title case
  citation += `, "${formatChicagoTitle(article.title)}"`;

  // Add journal name (italicized)
  citation += `, *${article.journal}*`;

  // Add volume and issue
  if (article.volume) {
    citation += ` ${article.volume}`;
  }

  if (article.issue) {
    citation += `, no. ${article.issue}`;
  }

  // Add year in parentheses
  if (article.year) {
    citation += ` (${article.year})`;
  }

  // Add page range with colon
  if (article.pages) {
    citation += `: ${formatChicagoPages(article.pages)}`;
  }

  // Add DOI or URL if available
  if (article.doi) {
    const cleanDoi = article.doi.replace('doi:', '').replace('https://doi.org/', '');
    citation += `, https://doi.org/${cleanDoi}`;
  } else if (article.url) {
    citation += `, ${article.url}`;
  }

  citation += '.';
  return citation;
}

function generateChicagoBibliography(article) {
  let citation = '';

  // Format authors for bibliography style (inverted first author)
  const formattedAuthors = formatChicagoBibliographyAuthors(article.authors);
  citation += formattedAuthors;

  // Add title in quotes with title case
  citation += ` "${formatChicagoTitle(article.title)}."`;

  // Add journal name (italicized)
  citation += ` *${article.journal}*`;

  // Add volume and issue
  if (article.volume) {
    citation += ` ${article.volume}`;
  }

  if (article.issue) {
    citation += `, no. ${article.issue}`;
  }

  // Add year in parentheses
  if (article.year) {
    citation += ` (${article.year})`;
  }

  // Add page range with colon
  if (article.pages) {
    citation += `: ${formatChicagoPages(article.pages)}`;
  }

  // Add DOI or URL if available
  if (article.doi) {
    const cleanDoi = article.doi.replace('doi:', '').replace('https://doi.org/', '');
    citation += `. https://doi.org/${cleanDoi}`;
  } else if (article.url) {
    citation += `. ${article.url}`;
  }

  citation += '.';
  return citation;
}

function formatChicagoNotesAuthors(authors) {
  if (typeof authors === 'string') {
    authors = [authors];
  }

  if (authors.length === 1) {
    return formatChicagoSingleAuthor(authors[0], false); // Notes style: First Last
  } else if (authors.length === 2) {
    return `${formatChicagoSingleAuthor(authors[0], false)} and ${formatChicagoSingleAuthor(authors[1], false)}`;
  } else if (authors.length === 3) {
    return `${formatChicagoSingleAuthor(authors[0], false)}, ${formatChicagoSingleAuthor(authors[1], false)}, and ${formatChicagoSingleAuthor(authors[2], false)}`;
  } else {
    // 4+ authors: First author et al.
    return `${formatChicagoSingleAuthor(authors[0], false)} et al.`;
  }
}

function formatChicagoBibliographyAuthors(authors) {
  if (typeof authors === 'string') {
    authors = [authors];
  }

  if (authors.length === 1) {
    return formatChicagoSingleAuthor(authors[0], true); // Bibliography: Last, First
  } else if (authors.length === 2) {
    return `${formatChicagoSingleAuthor(authors[0], true)}, and ${formatChicagoSingleAuthor(authors[1], false)}`;
  } else if (authors.length === 3) {
    return `${formatChicagoSingleAuthor(authors[0], true)}, ${formatChicagoSingleAuthor(authors[1], false)}, and ${formatChicagoSingleAuthor(authors[2], false)}`;
  } else if (authors.length <= 10) {
    // List all authors up to 10
    const firstAuthor = formatChicagoSingleAuthor(authors[0], true);
    const middleAuthors = authors.slice(1, -1).map(author => formatChicagoSingleAuthor(author, false)).join(', ');
    const lastAuthor = formatChicagoSingleAuthor(authors[authors.length - 1], false);
    return `${firstAuthor}, ${middleAuthors}, and ${lastAuthor}`;
  } else {
    // 11+ authors: First 7 + et al.
    const first7 = authors.slice(0, 7);
    const formatted = first7.map((author, index) => 
      formatChicagoSingleAuthor(author, index === 0)
    ).join(', ');
    return `${formatted}, et al.`;
  }
}

function formatChicagoSingleAuthor(author, invertName) {
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
      
      if (invertName) {
        // Bibliography style: "Last, First Middle"
        let formatted = `${lastName}, ${firstName}`;
        if (author.authors_middlename && author.authors_middlename.trim()) {
          const middleName = author.authors_middlename.trim().replace('.', '');
          formatted += ` ${middleName}`;
        }
        return formatted;
      } else {
        // Notes style: "First Middle Last"
        let formatted = firstName;
        if (author.authors_middlename && author.authors_middlename.trim()) {
          const middleName = author.authors_middlename.trim().replace('.', '');
          formatted += ` ${middleName}`;
        }
        formatted += ` ${lastName}`;
        return formatted;
      }
    }
    // Handle legacy format
    else if (author.last && author.first) {
      if (invertName) {
        return `${author.last}, ${author.first}`;
      } else {
        return `${author.first} ${author.last}`;
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
      const firstNames = parts.slice(0, -1).join(' ');
      
      if (invertName) {
        return `${lastName}, ${firstNames}`;
      } else {
        return `${firstNames} ${lastName}`;
      }
    }
    return author;
  }
  
  console.warn('Unexpected author format:', typeof author, author);
  return '[Unknown Author Format]';
}

function formatChicagoTitle(title) {
  // Chicago uses title case (capitalize all major words)
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

function formatChicagoPages(pages) {
  if (typeof pages === 'string') {
    // Remove any existing 'p.' or 'pp.' prefix
    return pages.replace(/^pp?\.\s*/, '');
  }
  return pages;
}








