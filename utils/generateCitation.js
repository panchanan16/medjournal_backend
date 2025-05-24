function formatAuthors(authors, style) {
  if (!authors.length) return '';

  if (style === 'APA') {
    return authors.map(a => `${a.authors_lastname}, ${a.authors_name[0]}.`).join(', ');
  }

  if (style === 'MLA') {
    if (authors.length === 1) {
      return `${authors[0].authors_lastname}, ${authors[0].authors_name}`;
    } else if (authors.length === 2) {
      return `${authors[0].authors_lastname}, ${authors[0].authors_name}, and ${authors[1].authors_name} ${authors[1].authors_lastname}`;
    } else {
      return `${authors[0].authors_lastname}, ${authors[0].authors_name}, et al.`;
    }
  }

  if (style === 'Chicago') {
    if (authors.length === 1) {
      return `${authors[0].authors_lastname}, ${authors[0].authors_name}`;
    } else {
      return authors.map(a => `${a.authors_name} ${a.authors_lastname}`).join(', ');
    }
  }

  if (style === 'Vancouver') {
    return authors.map(a => `${a.authors_lastname} ${a.authors_name[0]}`).join(', ');
  }

  return '';
}

export function generateCitation(data, style) {
  const {
    authors, title, journal, year,
    volume, issue, pages, doi
  } = data;

  const formattedAuthors = formatAuthors(authors, style);

  switch (style) {
    case 'APA':
      return `${formattedAuthors} (${year}). ${title}. *${journal}*, ${volume}${issue ? `(${issue})` : ''}, ${pages}.${doi ? ` https://doi.org/${doi}` : ''}`;
    case 'MLA':
      return `${formattedAuthors}. "${title}." *${journal}* ${volume}${issue ? `.${issue}` : ''} (${year}): ${pages}.${doi ? ` https://doi.org/${doi}` : ''}`;
    case 'Chicago':
      return `${formattedAuthors}. "${title}." *${journal}* ${volume}${issue ? `, no. ${issue}` : ''} (${year}): ${pages}.${doi ? ` https://doi.org/${doi}` : ''}`;
    case 'Vancouver':
      return `${formattedAuthors}. ${title}. ${journal}. ${year};${volume}${issue ? `(${issue})` : ''}:${pages}.${doi ? ` doi:${doi}` : ''}`;
    default:
      return 'Unsupported citation style.';
  }
}
