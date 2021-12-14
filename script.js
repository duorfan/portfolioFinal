const app = {
    initialize: () => {
        app.client = contentful.createClient({
          space: "fvu0xvbs4745",
          accessToken: "HCC2xlChZlg8Jed8Ae0iiY49TA6obeRBh533rxmuWts"
        });
      },
    
      getEntry: entry => {
        // a known issue with the contentful library is that embedded images are ignored in rich text
        // this is the current workaround: https://github.com/contentful/rich-text/issues/61
        const options = {
          renderNode: {
              'embedded-asset-block': ({ data: { target: { fields }}}) => {
                return `<img src="${fields.file.url}" height="${fields.file.details.image.height}" width="${fields.file.details.image.width}" alt="${fields.description}"/>`;
              }
          }
        };
        app.client.getEntry(entry).then(project => {
          const projectData = {
            title: project.fields.title,
            imageUrl: `http:${project.fields.image.fields.file.url}`,
            // imageUrl2: `http:${project.fields.image2.fields.file.url}`,
            imageTitle: project.fields.image.fields.title,
            description:  project.fields.description ? documentToHtmlString(project.fields.description, options) : '' // passing in the options obj i created above for the bug
            
        };
          
          fetch('projectPage.mustache')
    
            .then(response => response.text())
            .then(template => {
         
              const rendered = Mustache.render(template, projectData);
        
              $('.container1').append(rendered);
            }
          );
        });
      },
      getAllEntries: function() {

        app.client.getEntries().then(response => {
        
          response.items.forEach(project => {
    
            const projectData = {
              title: project.fields.title,
              imageUrl: `http:${project.fields.image.fields.file.url}`,
              imageTitle: project.fields.image.fields.title,
              slug: `${project.fields.slug}.html`
            };

            fetch('projectOnHome.mustache')
              .then(response => response.text())
              .then(template => {
                const rendered = Mustache.render(template, projectData);
                $('.container0').append(rendered);
              }
            );
          });
        });
      }
  };