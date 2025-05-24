export function generateMLAJournalCitation(article) {
  // Validate required fields
  if (!article.authors || !article.title || !article.journal) {
    throw new Error('Missing required fields: authors, title, and journal are required');
  }

  let citation = '';

  // Format authors (different from APA)
  const formattedAuthors = formatMLAAuthors(article.authors);
  citation += formattedAuthors;

  // Add title in quotes with proper capitalization
  citation += ` "${formatMLATitle(article.title)}."`;

  // Add journal name (italicized)
  citation += ` *${article.journal}*`;

  // Add volume and issue
  if (article.volume) {
    citation += `, vol. ${article.volume}`;
  }

  if (article.issue) {
    citation += `, no. ${article.issue}`;
  }

  // Add year
  if (article.year) {
    citation += `, ${article.year}`;
  }

  // Add page range
  if (article.pages) {
    citation += `, pp. ${formatMLAPages(article.pages)}`;
  }

  // Add DOI or URL if available
  if (article.doi) {
    const cleanDoi = article.doi.replace('doi:', '').replace('https://doi.org/', '');
    citation += `. DOI: ${cleanDoi}`;
  } else if (article.url) {
    citation += `. Web. ${article.url}`;
  }

  citation += '.';

  return citation;
}

function formatMLAAuthors(authors) {
  if (typeof authors === 'string') {
    // If single author as string, convert to array
    authors = [authors];
  }

  if (authors.length === 1) {
    return formatMLASingleAuthor(authors[0], true); // First author gets special formatting
  } else if (authors.length === 2) {
    return `${formatMLASingleAuthor(authors[0], true)}, and ${formatMLASingleAuthor(authors[1], false)}`;
  } else if (authors.length >= 3) {
    // In MLA, for 3+ authors, you can list first author + "et al." OR list all
    // This implementation lists all authors
    const firstAuthor = formatMLASingleAuthor(authors[0], true);
    const middleAuthors = authors.slice(1, -1).map(author => formatMLASingleAuthor(author, false)).join(', ');
    const lastAuthor = formatMLASingleAuthor(authors[authors.length - 1], false);
    
    if (authors.length === 3) {
      return `${firstAuthor}, ${middleAuthors}, and ${lastAuthor}`;
    } else {
      return `${firstAuthor}, ${middleAuthors}, and ${lastAuthor}`;
    }
  }
}

function formatMLASingleAuthor(author, isFirst) {
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
        // First author: "Last, First Middle"
        let formatted = `${lastName}, ${firstName}`;
        if (author.authors_middlename && author.authors_middlename.trim()) {
          const middleName = author.authors_middlename.trim().replace('.', '');
          formatted += ` ${middleName}`;
        }
        return formatted;
      } else {
        // Subsequent authors: "First Middle Last"
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
      if (isFirst) {
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
      
      if (isFirst) {
        return `${lastName}, ${firstNames}`;
      } else {
        return `${firstNames} ${lastName}`;
      }
    }
    return author; // Return as-is if can't parse
  }
  
  console.warn('Unexpected author format:', typeof author, author);
  return '[Unknown Author Format]';
}

function formatMLATitle(title) {
  // MLA uses title case (capitalize all major words)
  return title
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Always capitalize first and last word
      if (index === 0 || index === title.split(' ').length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      // Don't capitalize articles, prepositions, conjunctions (unless first/last word)
      const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
      
      if (lowercaseWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      
      // Capitalize after colons and hyphens
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/:\s*\w/g, match => match.toUpperCase()) // Capitalize after colons
    .replace(/-\w/g, match => match.toUpperCase()); // Capitalize after hyphens
}

function formatMLAPages(pages) {
  if (typeof pages === 'string') {
    // Remove any existing 'p.' or 'pp.' prefix
    return pages.replace(/^pp?\.\s*/, '');
  }
  return pages;
}

