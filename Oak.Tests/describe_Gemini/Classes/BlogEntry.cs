using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NSpec;
using System.Dynamic;
using System.Reflection;

namespace Oak.Tests.describe_Gemini.Classes
{
    public class BlogEntry : Gemini
    {
        public BlogEntry(object o)
            : base(o)
        {

        }

        public bool IsValid()
        {
            return !string.IsNullOrEmpty(Expando.Title);
        }

        public string Body
        {
            get
            {
                return "";
            }
        }
    }
}