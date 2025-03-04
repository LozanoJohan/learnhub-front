import { clubs } from "../data/clubs";
import type { Club } from "../models/clubs";
import { BaseService } from "./baseService";

class ClubsService extends BaseService<Club> {
  constructor() {
    super(clubs);
  }
  
  /**
   * Get clubs by tag
   * @param tag Tag to search
   */
  getByTag(tag: string): Club[] {
    const lowerTag = tag.toLowerCase();
    return this.items.filter(club => 
      club.tags.some(clubTag => clubTag.toLowerCase().includes(lowerTag))
    );
  }
  
  /**
   * Search clubs by text in title or description
   * @param text Text to search
   */
  searchByText(text: string): Club[] {
    const lowerText = text.toLowerCase();
    return this.items.filter(club => 
      club.title.toLowerCase().includes(lowerText) || 
      club.description.toLowerCase().includes(lowerText)
    );
  }
  
  /**
   * Get clubs by multiple tags (must contain at least one)
   * @param tags List of tags to search
   */
  getByTags(tags: string[]): Club[] {
    const lowerTags = tags.map(tag => tag.toLowerCase());
    return this.items.filter(club => 
      club.tags.some(clubTag => 
        lowerTags.some(tag => clubTag.toLowerCase().includes(tag))
      )
    );
  }
}

export const clubsService = new ClubsService(); 