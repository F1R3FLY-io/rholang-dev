---
layout: default
title: Blog
nav_order: 4
permalink: /blog/
---

# Rholang Blog

Stay updated with the latest news, tutorials, and community highlights.

<div class="blog-posts">
{% for post in site.posts %}
  <article class="blog-post-preview">
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <time class="post-date">{{ post.date | date: "%B %d, %Y" }}</time>
    {% if post.author %}
      <span class="post-author">by {{ post.author }}</span>
    {% endif %}
    <div class="post-excerpt">
      {{ post.excerpt | strip_html | truncate: 300 }}
    </div>
    <a href="{{ post.url | relative_url }}" class="read-more">Read more →</a>
  </article>
{% endfor %}
</div>

{% if paginator.total_pages > 1 %}
<nav class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | relative_url }}" class="prev">← Newer Posts</a>
  {% endif %}
  <span class="page-number">Page {{ paginator.page }} of {{ paginator.total_pages }}</span>
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | relative_url }}" class="next">Older Posts →</a>
  {% endif %}
</nav>
{% endif %}

<style>
.blog-post-preview {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.blog-post-preview:last-child {
  border-bottom: none;
}

.blog-post-preview h2 {
  margin-bottom: 0.5rem;
}

.post-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.post-author {
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.post-excerpt {
  margin: 1rem 0;
  line-height: 1.6;
}

.read-more {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.read-more:hover {
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.page-number {
  color: #6b7280;
}
</style>