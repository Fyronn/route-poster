using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblSeferAtamalari
{
    public int AtamaId { get; set; }

    public int? SeferId { get; set; }

    public int? AracId { get; set; }

    public int? SoforId { get; set; }

    public int? ServisYoneticisiId { get; set; }

    public virtual TblAraclar? Arac { get; set; }

    public virtual TblSeferler? Sefer { get; set; }

    public virtual TblKullanicilar? ServisYoneticisi { get; set; }

    public virtual TblKullanicilar? Sofor { get; set; }
}
